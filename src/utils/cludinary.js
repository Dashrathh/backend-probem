import {v2 as clodinary} from "cloudinary"

import fs from  "fs"



cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_CLOUD_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  
});

const url = cloudinary.url("olympic_flag", {
    width: 100,
    height: 150,
    crop: 'fill'
  });
  

  const uploadOnCloudinary = async (localFilePath) => {

    try {
        if(!localFilePath) return null  // agar local me file path nahi he to return null aayega
        
        //  upload the file on cloudinary 
      const response =  await clodinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        } )


        // file has been uploaded successfull

        console.log("file is uploaded on cloudinary" , response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file the upload operation got failed
        return null
    }
  }


  export {uploadOnCloudinary};