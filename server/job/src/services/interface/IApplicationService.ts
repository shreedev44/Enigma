import { IApplicationSchema } from '@entities'

export interface IApplicationService {
    createApplication(userId: string, jobId: string, file: Express.Multer.File): Promise<IApplicationSchema>
    deleteApplication(userId: string, applicationId: string): Promise<boolean>
    getApplicationsByUserId(
        userId: string,
        page: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
    getApplicationsByJobId(
        jobId: string,
        userId: string,
        page: number,
        tags: string[]
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
    shortlistApplications(jobId: string, userId: string, tags: string[]): Promise<{ shortlisted: number }>
    getShortlist(
        jobId: string,
        userId: string,
        page: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
    getApplicationDetails(applicationId: string, jobId: string, userId: string): Promise<IApplicationSchema>
    getResumeUrl(applicationId: string, jobId: string, userId: string): Promise<string>
}
