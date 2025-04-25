import pdf from 'pdf-parse'
import { IApplicationService } from '@services/interface'
import { IApplicationSchema } from '@entities'
import { IApplicationRepository, IJobRepository } from '@repositories/interface'
import { createHttpError, generatePresignedUrl, generateUID, uploadResume, validateApplication } from '@utils'
import { _HttpStatus, Messages, parsePrompt } from '@constants'
import { Types } from 'mongoose'
import { geminiModel } from '@configs'

export class ApplicationService implements IApplicationService {
    constructor(
        private _applicationRepository: IApplicationRepository,
        private _jobRepository: IJobRepository
    ) {}

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

        const valid = validateApplication(result)
        if (valid) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.FAILED_TO_PARSE(valid.field))
        }

        const filename = result.name + '-' + (await generateUID())
        const key = await uploadResume(file, filename)
        if (!key) {
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.FAILED_TO_UPLOAD)
        }
        const application = await this._applicationRepository.create({
            ...result,
            userId: new Types.ObjectId(userId),
            jobId: new Types.ObjectId(jobId),
            resume: key,
        })
        return application
    }

    async deleteApplication(userId: string, applicationId: string): Promise<boolean> {
        const isDeleted = await this._applicationRepository.deleteById(
            new Types.ObjectId(userId),
            new Types.ObjectId(applicationId)
        )

        if (!isDeleted) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICATION_NOT_FOUND)
        }
        return isDeleted
    }

    async getApplicationsByUserId(
        userId: string,
        page: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        const dataPerPage = 1
        const skip = dataPerPage * page - 1
        const result = await this._applicationRepository.findApplicationsByUserId(
            new Types.ObjectId(userId),
            skip,
            dataPerPage
        )

        return result
    }

    async getApplicationsByJobId(
        jobId: string,
        userId: string,
        page: number,
        tags: string[]
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )
        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        const dataPerPage = 1
        const skip = dataPerPage * page - 1
        const result = await this._applicationRepository.findApplicationsByJobId(
            new Types.ObjectId(jobId),
            skip,
            dataPerPage,
            tags
        )

        return result
    }

    async shortlistApplications(jobId: string, userId: string, tags: string[]): Promise<{ shortlisted: number }> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )
        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        const result = await this._applicationRepository.shortlistApplications(new Types.ObjectId(jobId), tags)
        return result
    }

    async getShortlist(
        jobId: string,
        userId: string,
        page: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )

        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        const dataPerPage = 1
        const skip = page * dataPerPage - 1
        const result = await this._applicationRepository.getShortlist(new Types.ObjectId(jobId), skip, dataPerPage)

        return result
    }

    async getApplicationDetails(applicationId: string, jobId: string, userId: string): Promise<IApplicationSchema> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )

        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        const application = await this._applicationRepository.findApplicationById(new Types.ObjectId(applicationId))
        if (!application) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICATION_NOT_FOUND)
        }
        return application
    }

    async getResumeUrl(applicationId: string, jobId: string, userId: string): Promise<string> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )

        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        const resumeKey = await this._applicationRepository.findResumeKey(new Types.ObjectId(applicationId))
        if (!resumeKey) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICATION_NOT_FOUND)
        }

        const url = generatePresignedUrl(resumeKey)
        return url
    }
}
