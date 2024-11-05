import { Router } from "express";

const router=Router();

router.route("/register").post(

    // data coming from the server is the json form 
    // from validation u need file handle 
    //  by multer u try to handle file --- added a middle ware 
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
        ,
        {
            name:"coverImage",
            maxCount:1

        }
    ])
        ,
    
    registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router