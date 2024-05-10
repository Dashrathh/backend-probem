import { v2 as cloudinary } from "cloudinary"; // Corrected import statement
import { response } from "express";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY, // Fixed variable name
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const url = cloudinary.url("olympic_flag", {
  width: 100,
  height: 150,
  crop: 'fill'
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // File has been uploaded successfully
    console.log("File is uploaded on Cloudinary:", response.url);
    return response;
  } catch (error) {
    // Handle error and clean up local file
    fs.unlinkSync(localFilePath);
    return response;
  }
};

console.log("URL:", url);

export { uploadOnCloudinary };
