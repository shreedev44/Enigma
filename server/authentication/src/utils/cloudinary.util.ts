import { deleteFromCloudinary, uploadToCloudinary } from '@configs'

export async function handleCloudinaryDelete(url: string) {
  const urlArr = url.split('/')
  let publicId = [urlArr[urlArr.length - 2], urlArr[urlArr.length - 1]].join(
    '/'
  )
  publicId = publicId.split('.')[0]
  try {
    await deleteFromCloudinary(publicId)
  } catch (error) {
    console.log('cloudinary error: ', error)
  }
}

export async function handleCloudinaryUpload(fileBuffer: Buffer) {
  const imageUrl = await uploadToCloudinary(fileBuffer)
  return imageUrl
}
