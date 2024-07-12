

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cludinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { response } from "express";
import mongoose from "mongoose";

//  +=+: access and refrsh token generate

const generateAccesAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });
        // Here refreshToken is saved in the database, then both accessToken and refreshToken are returned.

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong");
    }
};

// ===== Register user ======

const registerUser = asyncHandler(async (req, res) => {
    // step 1: get user detail from frontend
    // step 2: validation - not empty
    // step 3: check if user already exists: username, email
    // step 4: check for images, check for avatar
    // step 5: upload them to cloudinary, avatar
    // step 6: create user object - create entry in db
    // step 7: remove password and refresh token field from response
    // step 8: check for user creation
    // step 9: return response

    // step 1: get user detail
    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    console.log(req.body);

    // step 2: validation not empty
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // step 3: check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    console.log(req.files);

    // step 4: check for images, check for avatar
    const avtarLocalPath = req.files?.avatar?.[0]?.path


   // ? is a show option
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
      
    // Upload them to cloudinary, avatar

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage[0]?.path)

        // step 4.1: check if avatar file exists
        if (!avtarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

    // step 5: upload them to cloudinary, avatar

    const avatar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // step 5.1: check if avatar upload failed

    if (!avatar) {
        throw new ApiError(400, "DSAvatar file upload failed");
    }

    // step 6: create user object - create entry in db

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
        
    });

    // step 7: check for user creation

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // step 9: return response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

//  ======== Login user ============

const loginUser = asyncHandler(async (req, res) => {

    // 1: get from data req.body 
    // 2: login with username or email
    // 3: find the user  
    // 4: password check 
    // 5: access and refrsh token generate
    // 6: send cookie    



    // 1: get from data req.body 

    const { email, username, password } = req.body

    //   2: login with username or email

    if ((!username && !email) || !password) {
        throw new ApiError(400, "username or password required")
    }


    //   agar dono username or email thi register ho to email login karva mate user ko find karvo padse
    //  User.findOne({email})   // basic case ya email or username


    // 3: find the user  er
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    //4: password check 
    const isPasswordValid = await user.isPasswordCorrect(password);

    //    console.log(isPasswordValid);
    // const isPasswordValid = await user.isPasswordCorrect(password)
    // const isPasswordValid = await user(password) 

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential")
    }

    //  5: Access and refresh token generate

    const { accessToken, refreshToken } = await generateAccesAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(

            new ApiResponse(

                200, {
                user: loggedInUser, accessToken,
                refreshToken
            },
                "User logged in successfully"
            )
        )
})

   //=============== logout user================

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndDelete(
        req.user._id,

        {
            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User looged out succesfully"))

})

// ========================== refreshtoken and accessToken endpoint=====================================

const refreshAceessToken = asyncHandler(async (req, res) => {

    {
        const incomingrefrehToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingrefrehToken) {
            throw new ApiError(401, "unauthorized request")
        }

        try {
            const decodedToken = jwt.verify(
                incomingrefrehToken,
                process.env.REFRESH_TOKEN_SECRET
            )

            const user = await User.findById(decodedToken?._id)

            if (!user) {
                throw new ApiError(401, "invalid refresh token")
            }

            if (incomingrefrehToken !== user?.refreshToken) {
                throw new ApiError(401, "Refresh token expired or used")
            }

            const option = {
                httpOnly: true,
                secure: true
            }



            // const tokens = await generateAccessTokenAndRefreshTokens(user._id);
            // const refreshToken = tokens.refreshToken;
            // const accessToken = tokens.accessToken;

            const { accessToken, newrefreshToken } = await generateAccesAndRefreshTokens(user._id)


            return res
                .status(200)
                .cookie("accessToken", accessToken, option)
                .cookie("refreshToken", newrefreshToken, option)

                .json(
                    new ApiResponse(
                        200,
                        { accessToken, newrefreshToken }
                    )
                )
        }

        catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }


    }
})


// =================================Chnage the passsword if user want  ===========================================================


  const changeCurrentPassword = asyncHandler(async(req,res) =>{

     const {oldPassword , newPassword} = req.body   /// take field from user
    //  user ko find kiya user.findById(req di .user ho to uski id do)

   const user = await User.findById(req.user?._id)  

// user agar password ko change karna chahta he 
// to use old password dalna padega but kaha
//  to hamne isPassworcorrectd method li jo hamne define ki thi user model me

  const isPasswordCorrect =  await  user.isPasswordCorrect(oldPassword)   // here isPassword correct method take from user model uske baad usme use hamne oldPassword diya


    if (!isPasswordCorrect) {
        throw new ApiError(400 , "Invalid old password")
    }
 

     // ab naya password set karna hai

    user.password = newPassword

    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "Password change successfully"))
  })



//     get current uset 

const getCurrentUser = asyncHandler(async(req, res) =>{

    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully")

})

   // updateDetails user name email 

   const updateAccountDetails = asyncHandler(async(req,res) =>{
    const {fullname , email} = req.body

    if(!fullname || !email){
        throw new ApiError(400 , "All field are required")
    }
     
   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName: fullname,
                email:email

            }
        },

        {new: true},
    )

    .select("-password")

    return  res
    .status(200)
    .json(new ApiResponse(200 , user, "Account detalid updated successfully"))

   })


     //==============Update avatar file===============
    
      const updateUserAvatar = asyncHandler(async(req,res) =>{
      const avatarLocalPath  =  req.files?.path

      if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar files is missing")
      }


      // delete 
      
     const oldAvatarUrl = user.avatar

     if(oldAvatarUrl){
         const oldvatarID  = oldAvatarUrl.split('/').pop().split()[0];
     await Cloudinary.uploader.dest
         console.log(oldvatarID);
 
     
     }
    const avatar = await  uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

     const user =  await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
     ).select("-password")
     return response
     .status(200)
     .json(
        new ApiResponse(200 , "Avatar image uploding successfully")
     )

      })




      //  cover Image
      const updateUserCoverImage = asyncHandler(async(req,res) =>{
        const coverImageLocalPath  =  req.file?.path
  
        if (!coverImageLocalPath) {
          throw new ApiError(400 , "cover image files is missing")
        }
  
      const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
      if (!coverImage.url) {
          throw new ApiError(400, "Error while uploading on avatar")
      }
  
      const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
              $set:{
                  coverImage: coverImage.url
              }
          },
          {new: true}
       ).select("-password")
       return response
       .status(200)
       .json(
          new ApiResponse(200 ,"Cover image updated successfully")
       )
  
       
        })
      
    



        // 
        //   Aggregation

         const getUserChannelProfile = asyncHandler(async(req,res) =>{
        
             const {username} = req.params  // param use url when you want data from user

             if (!username?.trim()) {
                throw new ApiError(400, "username is missing")
                
             }

             // here we can find 

            //  User.find({username})  // after that you add aggregation pipline but here sort way 

             const channel =  await User.aggregate([
                {
                    $match:{
                        username:username?.toLowerCase()
                    }
                },
                {
                    $lookup:{
                        from:"subscription",     // lookup use two different collection join
                        localField:"_id",
                        foreignField:"channel",   // when you select chnnel to subcriber milega  thats all  
                                              // and when you select subcriber  to milegi channel
                        as: "subcribers"
                    }
                },
                
                 {
                    $lookup:{
                        from:"subscription",
                        localField:"_id",
                        foreignField:"subscriber",   // when you select chnnel to subcriber milega  thats all    // and when you select subcriber  to milegi channel
                        as: "subscribedTo"
                    }
                 },
                 {
                    $addFields:{
                        subscribersCount:{
                            $size:"$subcribers"
                        },
                        channelsSubscribedToCount:{
                            $size: "$subcribedTo"
                        },
                        isSubscribed:{
                             $cond:{
                                if:{$in:[req.user?._id, "subcribers.subscriber"]},
                                then:true,
                                else:false
                             }
                        }
                    }
                 },
                 {
                    $project:{
                        fullname:1,   // project sari vallue nahi bdeta selected deta he jab hame selected value chaiye tab project use hota h
                        username:1,
                        subscribersCount:1,
                        channelsSubscribedToCount:1,
                        avatar:1,
                        coverImage:1,
                        email:1
                    }
                 }

               ])
      

         if (!channel?.length) {
            throw new ApiError(404," channel doesnot exist");
         }

         return res
         .status(200)
         .json(
            new ApiResponse(200,channel[0],"User channel fetched successfully")
         )
        
        })
 
        //   get watch hiestrory

       const getWatchHisory = asyncHandler(async(req,res) =>{

        // req.user._id  // ye mogodb ki id nahi milti he ye mongoose ki string milti jo mongoose aoutomatically convert kar deta h

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
            {
                $lookup:{
                    from:"vedeos",
                    localField:"watchHistory",
                    foreignField:"_id",
                    as:"watchHistory",
                    pipeline:[
                        {
                            $lookup: {
                                from : "users",
                                localField: "owner",
                                foreignField:"_id",
                                as: "owner",
                                pipeline:[
                                {
                                    $project:{
                                        fullName: 1,
                                        username:1,
                                        avatar:1
                                    }
                                },
                                {
                                   $addFields:{
                                    owner:{
                                        $first: "$owner"
                                    }
                                   } 
                                }
                                ]
                            }
                        }
                    ]
                }
            }
        
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(200,user[0].WatchHisory ,"watchHistory fetched successfully")
        
        // aggregation return array so here use user[0] it return first
    )
       })
       
 
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAceessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    updateAccountDetails,
    getWatchHisory
};

