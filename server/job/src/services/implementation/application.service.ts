import pdf from 'pdf-parse'
import { IApplicationService } from '@services/interface'
import { IApplicationSchema } from '@entities'
import { IApplicationRepository } from '@repositories/interface'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages, parsePrompt } from '@constants'
import { Types } from 'mongoose'
import { geminiModel } from '@configs'

export class ApplicationService implements IApplicationService {
    constructor(private _applicationRepository: IApplicationRepository) {}

    async createApplication(userId: string, jobId: string, file: Express.Multer.File): Promise<IApplicationSchema> {
        const applicationExist = await this._applicationRepository.findApplication(
            new Types.ObjectId(userId),
            new Types.ObjectId(jobId)
        )

        if (applicationExist) {
            throw createHttpError(_HttpStatus.CONFLICT, Messages.APPLICATION_EXISTS)
        }

        const resumeData = await pdf(file.buffer)
        const { response } = await geminiModel.generateContent(
            parsePrompt.replace('resume_text_here', String(resumeData.text))
        )
        const result = JSON.parse(response.text().replace(/```json\n|\n```/g, ''))
        const application = await this._applicationRepository.create({
            ...result,
            userId: new Types.ObjectId(userId),
            jobId: new Types.ObjectId(jobId),
        })
        return application
    }

    async deleteApplication(userId: string, applicationId: string): Promise<boolean> {
        const isDeleted = await this._applicationRepository.deleteById(new Types.ObjectId(userId), applicationId)

        if (!isDeleted) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICATION_NOT_FOUND)
        }
        return isDeleted
    }

    async getApplicationsByUserId(userId: string): Promise<IApplicationSchema[]> {
        const applications = await this._applicationRepository.findApplicationsByUserId(new Types.ObjectId(userId))

        return applications
    }

    async getApplicationsByJobId(jobId: string): Promise<IApplicationSchema[]> {
        const applications = await this._applicationRepository.findApplicationsByJobId(new Types.ObjectId(jobId))
        return applications
    }
}
