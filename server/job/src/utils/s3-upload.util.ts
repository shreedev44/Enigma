import { env, s3 } from '@configs'

export async function uploadResume(file: Express.Multer.File, filename: string) {
    const params = {
        Bucket: env.S3_BUCKET_NAME,
        Key: `resume/${filename}.pdf`,
        Body: file.buffer,
        ContentType: 'application/pdf',
    }
    try {
        const data = await s3.upload(params).promise()
        return data.Key
    } catch (error) {
        console.error(error)
        return null
    }
}

export function generatePresignedUrl(key: string) {
    const params = {
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Expires: 60,
        ResponseContentDisposition: `attachment; filename="${key.split('/')[1]}"`,
    }

    return s3.getSignedUrl('getObject', params)
}
