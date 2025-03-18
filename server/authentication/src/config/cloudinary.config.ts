import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.config";

export function cloudinaryConfig() {
  cloudinary.config({
    cloud_name: "dgdimswvi",
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

function uploadToCloudinary(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profile_pictures" },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result?.secure_url) {
          resolve(result?.secure_url);
        } else {
          reject(new Error("Upload failed: No secure URL returned"));
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}

function deleteDromCloudinary(publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, {type: "upload", resource_type: "image"}, 
      (error, reuslt) => {
        if(error) {
          reject(error);
        } else {
          resolve(reuslt)
        }
      }
    )
  })
}

export async function handleCloudinaryDelete(url: string) {
  const urlArr = url.split('/')
  let publicId = [urlArr[urlArr.length - 2], urlArr[urlArr.length - 1]].join('/')
  publicId = publicId.split('.')[0]
  try {
    await deleteDromCloudinary(publicId);
  } catch (error) {
    console.log("cloudinary error: ", error)
  }
}

export async function handleCloudinaryUpload(fileBuffer: Buffer) {
  const imageUrl = await uploadToCloudinary(fileBuffer);
  return imageUrl;
}
