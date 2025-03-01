import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { Language } from "../Types/types";
import generateUID from "./generate-uid.util";

const CODE_DIR = path.resolve(__dirname, "../../temp");
const LANGUAGES = JSON.parse(
  fs.readFileSync(path.join(__dirname, "languages.util.json"), "utf8")
);

if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
}

export const executeCode = async (language: Language, code: string) => {
  const langConfig = LANGUAGES[language];
  const fileId = await generateUID();
  const filePath = path.resolve(
    __filename,
    CODE_DIR,
    `${fileId}.${langConfig.extension}`
  );
  const outputFile = path.resolve(__dirname, CODE_DIR, `${fileId}.out`);
  const containerName = `compiler-${fileId}`;

  fs.writeFileSync(filePath, code);

  let compileCommand = langConfig.compile
    ? langConfig.compile.replace(
        "{filename}",
        fileId + "." + langConfig.extension
      )
    : null;

  let execCommand = langConfig.command
    .replace("{filename}", fileId + "." + langConfig.extension)
    .replace("{outputfile}", fileId)
    .replace("{mainClass}", fileId);

  return new Promise((resolve, reject) => {
    let dockerCmd = `docker run --rm --name ${containerName} -v "${CODE_DIR}:/app" ${langConfig.image} sh -c "`;

    if (compileCommand) dockerCmd += `${compileCommand} && `;
    dockerCmd += `${execCommand} > /app/${fileId}.out 2>&1"`;

    exec(dockerCmd, { timeout: 5000 }, (error) => {
      let output = "";

      if (fs.existsSync(outputFile)) {
        output = fs.readFileSync(outputFile, "utf8");
        fs.unlinkSync(outputFile);
      }

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      resolve({ stdout: output, stderr: error ? error.message : "" });
    });
  });
};
