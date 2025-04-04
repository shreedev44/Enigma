/* eslint-disable @typescript-eslint/no-explicit-any */
export class Compile {
    stdout: string
    stderr: string
    stats: {
        memoryUsage: string
        executionTime: string
    }

    constructor(result: any) {
        this.stdout = result.stdout
        this.stderr = result.stderr
        this.stats = {
            memoryUsage: result.stats.memoryUsage,
            executionTime: result.stats.executionTime,
        }
    }
}
