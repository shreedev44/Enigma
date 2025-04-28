import { ApplicationDTO } from '@dtos'

export interface IApplicationService {
    createApplication(userId: string, jobId: string, file: Express.Multer.File): Promise<void>
    deleteApplication(userId: string, applicationId: string): Promise<boolean>
    getApplicationsByUserId(userId: string, page: number): Promise<InstanceType<typeof ApplicationDTO.MyApplications>>
    getApplicationsByJobId(
        jobId: string,
        userId: string,
        page: number,
        tags: string[]
    ): Promise<InstanceType<typeof ApplicationDTO.Applications>>
    shortlistApplications(jobId: string, userId: string, tags: string[]): Promise<{ shortlisted: number }>
    getShortlist(jobId: string, userId: string, page: number): Promise<InstanceType<typeof ApplicationDTO.Applications>>
    getApplicationDetails(
        applicationId: string,
        jobId: string,
        userId: string
    ): Promise<InstanceType<typeof ApplicationDTO.ApplicationInfo>>
    getResumeUrl(applicationId: string, jobId: string, userId: string): Promise<string>
}
