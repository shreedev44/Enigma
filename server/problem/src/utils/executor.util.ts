import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { Language } from '../Types/types';
import generateUID from './generate-uid.util';

const CODE_DIR = '/app/temp';

if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
}

const docker = new Docker({
  host: 'dind',
  port: 2375,
  protocol: 'http'
});

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

  try {
    console.log(`Pulling image: ${langConfig.image}`);
    await new Promise((resolve, reject) => {
      docker.pull(langConfig.image, (err: any, stream: any) => {
        if (err) {
          console.error('Error pulling image:', err);
          reject(err);
          return;
        }
        
        docker.modem.followProgress(stream, (err: any, output: any) => {
          if (err) {
            console.error('Error following pull progress:', err);
            reject(err);
            return;
          }
          resolve(output);
        });
      });
    });

    const container = await docker.createContainer({
      Image: langConfig.image,
      name: containerName,
      Cmd: ['sh', '-c', cmd],
      HostConfig: {
        Binds: [`${CODE_DIR}:/app`],
        AutoRemove: true
      }
    });

    await container.start();

    const waitPromise = container.wait();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Execution timed out')), 5000)
    );

    await Promise.race([waitPromise, timeoutPromise])
      .catch(async (error) => {
        console.error('Execution error or timeout:', error.message);
        try {
          await container.stop();
        } catch (stopError) {
        }
        throw error;
      });

    let output = '';
    if (fs.existsSync(outputFile)) {
      output = fs.readFileSync(outputFile, 'utf8');
      fs.unlinkSync(outputFile);
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return { stdout: output, stderr: '' };
  } catch (error) {
    console.error('Docker execution error:', error);
    return { 
      stdout: '', 
      stderr: error instanceof Error ? error.message : String(error) 
    };
  }
};