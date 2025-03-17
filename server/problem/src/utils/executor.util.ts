import Docker from "dockerode";
import fs from "fs";
import path from "path";
import { Language } from "../Types/types";
import { ContainerPool } from "./container-pool.util";

const CODE_DIR = "/app/temp";
const EXECUTION_TIMEOUT = 3000;

if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
}

const docker = new Docker({
  host: "dind",
  port: 2375,
  protocol: "http",
});

const containerPool = new ContainerPool(docker);

const LANGUAGES = JSON.parse(
  fs.readFileSync(path.join(__dirname, "languages.util.json"), "utf8")
);

export const executeCode = async (language: Language, code: string) => {
  const langConfig = LANGUAGES[language];
  const filePath = path.join(CODE_DIR, `Main.${langConfig.extension}`);
  const outputFile = path.join(CODE_DIR, `Main.out`);
  const compileFile = path.join(
    CODE_DIR,
    `Main.${langConfig.compileFileExtension}`
  );

  fs.writeFileSync(filePath, code);

  let compileCommand = langConfig.compile
    ? langConfig.compile.replace(
        "{filename}",
        "Main" + "." + langConfig.extension
      )
    : null;

  let execCommand = langConfig.command

  let cmd = "";
  if (compileCommand) cmd += `${compileCommand} && `;
  cmd += `${execCommand} > /app/Main.out 2>&1`;

  console.log(`Running command in container: ${cmd}`);

  let container: Docker.Container | null = null;
  let pooledContainer = false;

  try {
    container = await containerPool.getContainer(langConfig.image);
    pooledContainer = !!container;

    if (!container) {
      container = await docker.createContainer({
        Image: langConfig.image,
        Cmd: ["sh", "-c", cmd],
        HostConfig: {
          Binds: [`${CODE_DIR}:/app`],
        },
      });

      await container.start();
    } else {
      const containerData = await container.inspect();
      if (!containerData.State.Running) {
        await container.start();
        console.log(
          "resuming container================================================================================================================="
        );
      }
      const exec = await container.exec({
        Cmd: ["sh", "-c", cmd],
        AttachStdout: true,
        AttachStderr: true,
      });
      await exec.start({});
    }

    const waitPromise = pooledContainer
      ? new Promise((res, rej) => setTimeout(res, 100))
      : container.wait();

    const timeoutPromise = new Promise((_, rej) =>
      setTimeout(() => rej(new Error("Execution timed out")), EXECUTION_TIMEOUT)
    );

    await Promise.race([waitPromise, timeoutPromise]).catch(async (err) => {
      console.error("Execution error or timeout:", err.message);
      if (!pooledContainer) {
        try {
          await container?.stop();
        } catch {}
      }
      throw err;
    });

    const waitForFile = async (outputFile: string) => {
      while (!fs.existsSync(outputFile) || fs.statSync(outputFile).size === 0) {
        await new Promise((res) => setTimeout(res, 50));
      }
      return fs.readFileSync(outputFile, "utf8");
    };

    let output = await waitForFile(outputFile);

    fs.unlinkSync(outputFile);
    if (fs.existsSync(compileFile)) {
      fs.unlinkSync(compileFile);
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (pooledContainer && container) {
      await containerPool.returnContainer(langConfig.image, container);
    } else if (container) {
      try {
        await container.remove({ force: true });
      } catch {}
    }
    
    return { stdout: output, stderr: "" };
  } catch (error) {
    console.error("Docker execution error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

    if (pooledContainer && container) {
      await containerPool.returnContainer(langConfig.image, container);
    } else if (container) {
      try {
        await container.remove({ force: true });
      } catch {}
    }

    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};
