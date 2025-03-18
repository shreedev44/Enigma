import Docker from "dockerode";
import path from "path";
import fs from "fs";

const LANGUAGES = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../constants/languages.constant.json"), "utf8")
);

const CODE_DIR = "/app/temp";

export class ContainerPool {
  private pools: Map<string, Docker.Container[]> = new Map();
  private maxPoolSize: number = 5;
  private docker: Docker;

  constructor(docker: Docker) {
    this.docker = docker;
    this.initialze()
  }

  async initialze() {
    for (const lang in LANGUAGES) {
      const image = LANGUAGES[lang].image;
      await this.prepopulatePool(image)
    }
  }

  async prepopulatePool(image: string, count: number = 1) {
    if (!this.pools.has(image)) {
      this.pools.set(image, []);
    }

    try {
      await this.pullImageIfNeeded(image);
    } catch (err) {
      console.error(`Failed to pull image: ${image} Error: ${err}`);
      return;
    }

    for (let i = 0; i < count; i++) {
      try {
        const container = await this.docker.createContainer({
          Image: image,
          Cmd: ["sleep", "3600"],
          HostConfig: {
            Binds: [`${CODE_DIR}:/app`],
          },
        });

        await container.start();

        this.pools.get(image)!.push(container);
        console.log(`Added container to pool for ${image}`);
      } catch (err) {
        console.error(`Failed to create container for ${image}:`, err);
      }
    }
  }

  async getContainer(image: string): Promise<Docker.Container | null> {
    const pool = this.pools.get(image);
    if (!pool || pool.length === 0) {
      try {
        await this.prepopulatePool(image, 1);
        return this.pools.get(image)?.pop() || null;
      } catch (err) {
        return null;
      }
    }

    return pool.pop() || null;
  }

  async returnContainer(image: string, container: Docker.Container) {
    const pool = this.pools.get(image);
    if (!pool) {
      this.pools.set(image, []);
    }

    if (pool!.length < this.maxPoolSize) {
      try {
        await container.exec({
          Cmd: ["rm", "-rf", "/app/*"],
          AttachStdout: true,
          AttachStderr: true,
        });

        this.pools.get(image)!.push(container);
      } catch (err) {
        try {
          await container.remove({ force: true });
        } catch {}
      }
    } else {
      try {
        await container.remove({ force: true });
      } catch {}
    }
  }

  private async pullImageIfNeeded(image: string): Promise<void> {
    const images = await this.docker.listImages();
    const exists = images.some(
      (img) => img.RepoTags && img.RepoTags.includes(image)
    );

    if (!exists) {
      return new Promise((resolve, reject) => {
        this.docker.pull(image, (err: any, stream: any) => {
          if (err) return reject(err);

          this.docker.modem.followProgress(stream, (err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    }
  }
}
