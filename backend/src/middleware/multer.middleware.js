import multer from "multer";

// we use multer  middle ware where we need  to upload the file in the cloudinary --------------------------->



// to save the uploaded data  we are using it for the disk storage --------------------------------------->
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})