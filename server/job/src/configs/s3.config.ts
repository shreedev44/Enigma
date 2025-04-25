import { S3 } from 'aws-sdk'
import { env } from '@configs'

export const s3 = new S3({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
})
