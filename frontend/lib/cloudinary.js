import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(filePath, folder = "oddfinds") {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return { secure_url: "https://picsum.photos/seed/placeholder/1200/1200" };
  }
  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { width: 1400, height: 1400, crop: "limit" },
    ],
  });
}

export default cloudinary;
