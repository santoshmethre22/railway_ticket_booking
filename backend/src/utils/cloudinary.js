import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: 'santoshhm', 
    api_key: '316947977628739', 
    api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response=cloudinary.uploader.upload(localFilePath,{

            resource_type:"auto"
        })

              // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {

        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
        
    }
}

console.log(uploadOnCloudinary);