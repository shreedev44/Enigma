import { JobDTO } from '@dtos'
import { IJobSchema } from '@entities'

export interface IJobService {
    createJob(userId: string, jobData: Partial<IJobSchema>): Promise<InstanceType<typeof JobDTO.JobInfo>>
    updateJob(userId: string, jobId: string, jobData: Partial<IJobSchema>): Promise<InstanceType<typeof JobDTO.JobInfo>>
    deleteJob(userId: string, jobId: string): Promise<boolean>
    getJobsByUserId(userId: string, page: number): Promise<InstanceType<typeof JobDTO.Jobs>>
    getAllJobs(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string,
        userId: string
    ): Promise<InstanceType<typeof JobDTO.Jobs>>
    getJobDetails(jobId: string): Promise<InstanceType<typeof JobDTO.JobInfo>>
}
