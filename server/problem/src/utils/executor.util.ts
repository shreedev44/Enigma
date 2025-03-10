import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { Language } from '../Types/types';
import generateUID from './generate-uid.util';
import { ContainerPool } from './container-pool.util';

const CODE_DIR = '/app/temp';
const EXECUTION_TIMEOUT = 3000

if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
}

const docker = new Docker({
  host: 'dind',
  port: 2375,
  protocol: 'http'
});

const containerPool = new ContainerPool(docker)

const LANGUAGES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'languages.util.json'), 'utf8')
);

export const executeCode = async (language: Language, code: string) => {
  const langConfig = LANGUAGES[language];
  const fileId = await generateUID();
  const filePath = path.join(CODE_DIR, `Main.${langConfig.extension}`);
  const outputFile = path.join(CODE_DIR, `Main.out`);
  const containerName = `compiler-${fileId}`;

  fs.writeFileSync(filePath, code);

  let compileCommand = langConfig.compile
    ? langConfig.compile.replace(
        '{filename}',
        'Main' + '.' + langConfig.extension
      )
    : null;

  let execCommand = langConfig.command
    .replace('{filename}', 'Main' + '.' + langConfig.extension)
    .replace('{outputfile}', 'Main')
    .replace('{mainClass}', 'Main');

  let cmd = '';
  if (compileCommand) cmd += `${compileCommand} && `;
  cmd += `${execCommand} > /app/Main.out 2>&1`;

  console.log(`Running command in container: ${cmd}`);

  let container: Docker.Container | null = null;
  let pooledContainer = false;

  try {
    container = await containerPool.getContainer(langConfig.image)
    pooledContainer = !!container
    

    if(!container) {
      container = await docker.createContainer({
        Image: langConfig.image,
        Cmd: ['sh', '-c', cmd],
        HostConfig: {
          Binds: [`${CODE_DIR}:/app`]
        }
      });

      await container.start()
    } else {
      const exec = await container.exec({
        Cmd: ['sh', '-c', cmd],
        AttachStdout: true,
        AttachStderr: true
      });
      await exec.start({});
    }

    const waitPromise = pooledContainer ? new Promise((res, rej) => setTimeout(res, 100)) : container.wait();

    const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error("Execution timed out")), EXECUTION_TIMEOUT))

    await Promise.race([waitPromise, timeoutPromise])
      .catch(async (err) => {
        console.error('Execution error or timeout:', err.message)
        if(!pooledContainer) {
          try {
            await container?.stop();
          } catch {}
        }
        throw err
      })

    let output = '';
    if (fs.existsSync(outputFile)) {
      output = fs.readFileSync(outputFile, 'utf8');
      fs.unlinkSync(outputFile);
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if(pooledContainer && container) {
      await containerPool.returnContainer(langConfig.image, container)
    } else if(container) {
      try { await container.remove({force: true}); } catch {}
    }

    return { stdout: output, stderr: '' };
  } catch (error) {
    console.error('Docker execution error:', error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    
    if (pooledContainer && container) {
      await containerPool.returnContainer(langConfig.image, container);
    } else if (container) {
      try { await container.remove({ force: true }); } catch {}
    }

    return { 
      stdout: '', 
      stderr: error instanceof Error ? error.message : String(error) 
    };
  }
};