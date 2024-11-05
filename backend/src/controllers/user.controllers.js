

import { asyncHandler } from "../utils/asyncHandler.js"

import {ApiError} from "../utils/apiError.js"

import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken= async (userId)=>{
    try {
        const user= await User.findOne(userId);

        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
        user.save({validateBeforeSave:false});
        
        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(404,"something went wrong while generating access or refesh token")
    }
}

const  registerUser=asyncHandler(async(req,res)=>{
    // get user details  from frontend--------------------------------->
    //   vALIDATION---------------------------------------------------->
    //check if user exist
    //check for the file
    // check for images or check for avatar
    // upload them to cloudinary
    // create user object- create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res

    // ---------------?//
    // we get user data from front end

    const {fullName,email,username,password}=req.body
    console.log("email",email);

    if(

        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){

        throw new ApiError(400,"all  fiels are required ");

    }

    // ------- this code for the validation of the user data this is the standere practice 

    const existedUser= await User.findOne({

        $or:[{username,email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist");
    }
    
    //********************************************************************** */
/* the above is  to handle the data of the what ever coming from the body 
the below is to hanndle the image and the avatar actually validation is the right word 
 that is from the multer middle ware 
*/

    const avatarLocalPath=req.files?.avatar[0]?.path
  //  console.log("this is the path for the avatar" ,avatarLocalPath)
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
   // console.log(coverImageLocaclPath);
// check for images or check for avatar
    if(!avatarLocalPath){
        throw new ApiError(409,"avatar image is required");
    }
 // upload them to cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(409,"Avatar file is required");
    }

    // create user object- create entry in db
    const user= await User.create({
        fullName,
        avatar:avatar?.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase() // here may be the error check once 
    })

   const createUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser){
        throw new ApiError(409," something went wrong while CreateUser error ");
    }

    return res.status(201).json(
        new ApiResponse(200,createUser,"user is registerd succesfully")
    )

})

const loginUser=asyncHandler(async(req,res)=>{
    //req body-->data
    // username or email
    // find the user 
    // password check 
    // access and refresh  token
    // send cookie


    const {username,email,password}=req.body

    if(!email && !username){
        throw new ApiError(404,"username  or email not found");
    }

  const user=await  User.findOne({
        $or:[{username},{email}]
    })

     if(!user){
        throw new ApiError(405,"user not found");
     }

    const isPasswordValid= await  user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(404,"password is wrong ");
    }

    const {refreshToken,accessToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser=await User.findOne(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true

    }

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            }
            ,
            " messege used logged in succesfully"
        )
    )

})


const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true

    }

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                
            }
            ,
            "user logged out successfully "
        )
    )
     

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request");

    }

   try {
     const decodedToken=jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user=findById(decodedToken?._id)
     if(!user){
         throw new ApiError(401,"invalid refresh token");
     }
 
     if(incomingRefreshToken!==user.refreshToken){
         throw new ApiError(401,"refresh token is expired or userd")
     }
 
    const options={
         httpOnly:true,
         secure:true
     }
 
   const {accessToken,newrefreshToken} = await generateAccessAndRefreshToken(user._id)
 
     return res
     .status(200)
     .cookie("accesToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(
         new ApiResponse(
             200,
 
            { accessToken,
             refreshToken:newrefreshToken
         }
         ,
         "access Token refreshed"
         )
     )
 
   } catch (error) {

    throw new ApiError(401,error?.messsege ||"error in the file ")
    
   }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

};