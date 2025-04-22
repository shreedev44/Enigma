import { IJobSchema } from '@entities'

export interface IJobService {
    createJob(userId: string, jobData: Partial<IJobSchema>): Promise<IJobSchema>
    updateJob(userId: string, jobId: string, jobData: Partial<IJobSchema>): Promise<IJobSchema | null>
    deleteJob(userId: string, jobId: string): Promise<boolean>
    getJobsByUserId(userId: string): Promise<IJobSchema[]>
    getAllJobs(): Promise<IJobSchema[]>
}
