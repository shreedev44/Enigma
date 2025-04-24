import { IApplicationSchema } from '@entities'

export interface IApplicationService {
    createApplication(userId: string, jobId: string, file: Express.Multer.File): Promise<IApplicationSchema>
    deleteApplication(userId: string, applicationId: string): Promise<boolean>
    getApplicationsByUserId(userId: string): Promise<IApplicationSchema[]>
    getApplicationsByJobId(jobId: string): Promise<IApplicationSchema[]>
}
