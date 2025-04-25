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
        page: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
}
