import Docker from 'dockerode'
import fs from 'fs'
import path from 'path'
import { Language } from '@types'
import { ContainerPool } from '@utils'

const CODE_DIR = '/app/temp'
const EXECUTION_TIMEOUT = 3000

if (!fs.existsSync(CODE_DIR)) {
    fs.mkdirSync(CODE_DIR, { recursive: true })
}

const docker = new Docker({
    host: 'dind',
    port: 2375,
    protocol: 'http',
})

const containerPool = new ContainerPool(docker)

const LANGUAGES = JSON.parse(fs.readFileSync(path.join(__dirname, '../constants/languages.constant.json'), 'utf8'))

export const executeCode = async (language: Language, code: string) => {
    const langConfig = LANGUAGES[language]
    const filePath = path.join(CODE_DIR, `Main.${langConfig.extension}`)
    const outputFile = path.join(CODE_DIR, `Main.out`)
    const compileFile = path.join(CODE_DIR, `Main.${langConfig.compileFileExtension}`)

    fs.writeFileSync(filePath, code)

    const compileCommand = langConfig.compile
        ? langConfig.compile.replace('{filename}', 'Main' + '.' + langConfig.extension)
        : null

    const execCommand = `{ sh -c '${langConfig.command}'; echo "===END==="; times; echo "Max Memory Usage: $(grep VmPeak /proc/self/status | awk "{print \\$2}") KB"; } 2>&1 | tee /app/output.log`

    let cmd = ''
    if (compileCommand) cmd += `${compileCommand} && `
    cmd += `${execCommand} > /app/Main.out 2>&1`

    console.log(`Running command in container: ${cmd}`)

    let container: Docker.Container | null = null
    let pooledContainer = false

    let executionTime = 'N/A'
    let memoryUsage = 'N/A'

    try {
        container = await containerPool.getContainer(langConfig.image)
        pooledContainer = !!container

        if (!container) {
            container = await docker.createContainer({
                Image: langConfig.image,
                Cmd: ['sh', '-c', cmd],
                HostConfig: {
                    Binds: [`${CODE_DIR}:/app`],
                },
            })

            await container.start()
        } else {
            const containerData = await container.inspect()
            if (!containerData.State.Running) {
                await container.start()
            }
            const exec = await container.exec({
                Cmd: ['sh', '-c', cmd],
                AttachStdout: true,
                AttachStderr: true,
            })
            await exec.start({})
        }

        const waitPromise = pooledContainer ? new Promise((res, _rej) => setTimeout(res, 100)) : container.wait()

        const timeoutPromise = new Promise((_, rej) =>
            setTimeout(() => rej(new Error('Execution timed out')), EXECUTION_TIMEOUT)
        )

        await Promise.race([waitPromise, timeoutPromise]).catch(async (err) => {
            console.error('Execution error or timeout:', err.message)
            if (!pooledContainer) {
                try {
                    await container?.stop()
                } catch {
                    /* empty */
                }
            }
            throw err
        })

        const waitForFile = async (outputFile: string) => {
            while (!fs.existsSync(outputFile) || fs.statSync(outputFile).size === 0) {
                await new Promise((res) => setTimeout(res, 50))
            }
            return fs.readFileSync(outputFile, 'utf8')
        }

        const output = await waitForFile(outputFile)

        const [actualOutput, stats] = output.split('===END===').map((s) => s.trim())

        const memoryUsageMatch = stats.match(/Max Memory Usage: (\d+) KB/)
        memoryUsage = memoryUsageMatch ? `${memoryUsageMatch[1]} KB` : 'Unknown'

        const timeMatches = stats.match(/(\d+)m([\d.]+)s/g)

        if (timeMatches && timeMatches.length >= 4) {
            const [userMinutes, userSeconds] = timeMatches[0].split('m').map((v) => parseFloat(v))
            const [systemMinutes, systemSeconds] = timeMatches[2].split('m').map((v) => parseFloat(v))

            executionTime = (userMinutes * 60 + userSeconds + (systemMinutes * 60 + systemSeconds)).toFixed(3)
        }

        fs.unlinkSync(outputFile)
        if (fs.existsSync(compileFile)) {
            fs.unlinkSync(compileFile)
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        if (pooledContainer && container) {
            await containerPool.returnContainer(langConfig.image, container)
        } else if (container) {
            try {
                await container.remove({ force: true })
            } catch {
                /* empty */
            }
        }

        return { stdout: actualOutput, stderr: '', stats: { memoryUsage, executionTime } }
    } catch (error) {
        console.error('Docker execution error:', error)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile)

        if (pooledContainer && container) {
            await containerPool.returnContainer(langConfig.image, container)
        } else if (container) {
            try {
                await container.remove({ force: true })
            } catch {
                /* empty */
            }
        }

        return {
            stdout: '',
            stderr: error instanceof Error ? error.message : String(error),
            stats: { memoryUsage, executionTime },
        }
    }
}
