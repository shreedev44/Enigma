import { IJobSchema } from '@entities'

export interface IJobService {
    createJob(userId: string, jobData: Partial<IJobSchema>): Promise<IJobSchema>
    updateJob(userId: string, jobId: string, jobData: Partial<IJobSchema>): Promise<IJobSchema | null>
    deleteJob(userId: string, jobId: string): Promise<boolean>
    getJobsByUserId(userId: string, page: number): Promise<{ jobs: IJobSchema[]; totalPages: number }>
    getAllJobs(
        page: number,
        sortBy: string,
        sortOrder: number,
        filter: string
    ): Promise<{ jobs: IJobSchema[]; totalPages: number }>
}
