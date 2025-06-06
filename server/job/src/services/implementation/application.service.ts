import pdf from 'pdf-parse'
import { IApplicationService } from '@services/interface'
import {
    IApplicationRepository,
    IBlacklistRepository,
    IInterviewRepository,
    IJobRepository,
} from '@repositories/interface'
import { createHttpError, generatePresignedUrl, generateUID, uploadResume, validateApplication } from '@utils'
import { _HttpStatus, Messages, parsePrompt } from '@constants'
import { Types } from 'mongoose'
import { geminiModel } from '@configs'
import { ApplicationDTO } from '@dtos'
import { applicationReceivedEvent } from '@producers'

export class ApplicationService implements IApplicationService {
    constructor(
        private _applicationRepository: IApplicationRepository,
        private _jobRepository: IJobRepository,
        private _interviewRepository: IInterviewRepository,
        private _blacklistRepository: IBlacklistRepository
    ) {}

    async createApplication(userId: string, jobId: string, file: Express.Multer.File): Promise<void> {
        const job = await this._jobRepository.findByJobId(new Types.ObjectId(jobId))
        const blacklisted = await this._blacklistRepository.getBlacklistedApplicant(
            new Types.ObjectId(job?.userId),
            new Types.ObjectId(userId)
        )

        if (blacklisted) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.BLOCKED_TO_APPLY)
        }

        const applicationExist = await this._applicationRepository.findApplication(
            new Types.ObjectId(userId),
            new Types.ObjectId(jobId)
        )

        if (applicationExist) {
            throw createHttpError(_HttpStatus.CONFLICT, Messages.APPLICATION_EXISTS)
        }

        if (!job?.listed) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.JOB_NOT_FOUND)
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

        if (!application) {
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.SERVER_ERROR)
        }
        await applicationReceivedEvent({
            fullName: application.name,
            email: application.email,
            jobTitle: `${job.role} ${job.companyName}`,
        })
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
    ): Promise<InstanceType<typeof ApplicationDTO.MyApplications>> {
        const dataPerPage = 4
        const skip = dataPerPage * (page - 1)
        const result = await this._applicationRepository.findApplicationsByUserId(
            new Types.ObjectId(userId),
            skip,
            dataPerPage
        )

        return new ApplicationDTO.MyApplications(result)
    }

    async getApplicationsByJobId(
        jobId: string,
        userId: string,
        page: number,
        tags: string[]
    ): Promise<InstanceType<typeof ApplicationDTO.Applications>> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )
        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        const dataPerPage = 6
        const skip = dataPerPage * (page - 1)
        const result = await this._applicationRepository.findApplicationsByJobId(
            new Types.ObjectId(jobId),
            skip,
            dataPerPage,
            tags
        )

        return new ApplicationDTO.Applications(result)
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
    ): Promise<InstanceType<typeof ApplicationDTO.Applications>> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )

        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        const dataPerPage = 6
        const skip = dataPerPage * (page - 1)
        const result = await this._applicationRepository.getShortlist(new Types.ObjectId(jobId), skip, dataPerPage)

        return new ApplicationDTO.Applications(result)
    }

    async getApplicationDetails(
        applicationId: string,
        jobId: string,
        userId: string
    ): Promise<InstanceType<typeof ApplicationDTO.ApplicationInfo>> {
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
        return new ApplicationDTO.ApplicationInfo(application)
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

    async shortlistSingleApplication(applicationId: string, jobId: string, userId: string): Promise<void> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )

        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        await this._applicationRepository.changeStatusById(new Types.ObjectId(applicationId), 'shortlisted')
    }

    async removeFromShortlist(applicationId: string, jobId: string, userId: string): Promise<void> {
        const job = await this._jobRepository.findByJobIdAndUserId(
            new Types.ObjectId(jobId),
            new Types.ObjectId(userId)
        )

        if (!job) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }

        await this._applicationRepository.changeStatusById(new Types.ObjectId(applicationId), 'rejected')
    }

    async getStats(): Promise<{ applicationsPerJob: number }> {
        const stats = await this._applicationRepository.getJobApplicationStats()
        return stats
    }

    async acceptShedule(applicationId: string, userId: string): Promise<void> {
        const application = await this._applicationRepository.findApplicationById(new Types.ObjectId(applicationId))
        if (!application || String(application?.userId) !== userId) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICATION_NOT_FOUND)
        }
        await this._applicationRepository.changeStatusById(new Types.ObjectId(applicationId), 'accepted')
    }

    async rejectShedule(applicationId: string, userId: string): Promise<void> {
        const application = await this._applicationRepository.findApplicationById(new Types.ObjectId(applicationId))
        if (!application || String(application?.userId) !== userId) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICATION_NOT_FOUND)
        }
        await this._applicationRepository.changeStatusById(new Types.ObjectId(applicationId), 'rejected')
        await this._interviewRepository.deleteByApplicationId(new Types.ObjectId(applicationId))
    }

    async getApplicationsPerDate(userId: string): Promise<{ date: string; count: number }[]> {
        const result = await this._applicationRepository.getApplicationsPerDay(new Types.ObjectId(userId))
        return result
    }
}
