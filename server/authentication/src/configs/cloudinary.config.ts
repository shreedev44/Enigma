import { v2 as cloudinary } from 'cloudinary'
import { env } from '@configs'

export function cloudinaryConfig() {
  cloudinary.config({
    cloud_name: 'dgdimswvi',
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })
}

export function uploadToCloudinary(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'profile_pictures' },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result?.secure_url) {
          resolve(result?.secure_url)
        } else {
          reject(new Error('Upload failed: No secure URL returned'))
        }
      }
    )
    uploadStream.end(fileBuffer)
  })
}

export function deleteFromCloudinary(publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { type: 'upload', resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  })
}
