import { v2 as cloudinary } from "cloudinary";
import { env } from "./ENV";

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

export async function hanldeCloudinaryUpload(fileBuffer: Buffer) {
  const imageUrl = await uploadToCloudinary(fileBuffer);
  return imageUrl;
}
