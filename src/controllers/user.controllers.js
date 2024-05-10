// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// import {User} from "../models/user.model.js"

// import { uploadOnCloudinary } from "../utils/cludinary.js";

// import { ApiRespose } from "../utils/ApiResponse.js";


// const registerUser = asyncHandler (async(req,res) => {
   
//     // step 1: get user detail from frontend    
//     // step 2: validation -not empty  
//     // step 3: check if user already exists :  username ,email
//     // step 4: check for images, check for avatar
//     // step 5: upload them to cloudinary , avatar
//     // step 6: creat user object - creat entry in db 
//     // step 7: remove password and refresh token field from response
//     // step 8: check for user creation 
//     // step 9: retuen response



//       // step 1 : get user detail
//       const {fullname,email,username,password } = req.body
//       console.log("email:",email);


//           // step 2: validation not 

//     //   if(fullname === ""){
//     //     throw new ApiError(400, "fullname is required")
//     //   }   // this is one by one check validation is empty or not

//     if ([fullname ,email,username , password].some((field) => field?.trim() === "")){
//            // some is method just like .map but is response true and false
//         throw new ApiError(400,"All field are required")
//     }


//     // step 3 : check if user already exist

//     const existedUser =  await User.findOne({
//         $or: [{username}, {email}]
//     });

//     if(existedUser){
//         throw new ApiError(409, "User with email or username already exists  ")
//     }

//     // step 4:  check for images, check for avatar


//    const avtarLocalPath  =  req.files?.avatar[0]?.path    // ? is a show option
//    const coverImageLocalPath  = req.files?.coverImage[0]?.path;

// })

//    if (!avtarLocalPath){
//     throw new ApiError(400, "Avatar file is required")
//    }


//        // step 5: upload them to cloudinary , avatar

//        const avatar = await uploadOnCloudinary(avtarLocalPath)
//      const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   
//       if(!avatar){
//         throw new ApiError(400, "Avatar file is required")

//       }

//           // step 6: creat user object - creat entry in db 

//       const user = await User.create({     
//             fullname,
//             avatar : avatar.url,
//             coverImage: coverImage?.url || "",
//             email,
//             password,
//             username : username.toLowerCase()
//           });
       
//           // step 7: check for user creation
//           // step 8: remove password and refresh token field from   :: here one another method use. select
// const createdUser = await User.findById(user._id).select(
//     "-password   -refreshToken"
// );

//           if (!createdUser) {
//             throw new ApiError(500, "Something went wrong while registering the user");
//         }
    
//         return res.status(201).json(
//             new ApiResponse(200, createdUser, "User registered successfully")
//         );
//     })

//     export { registerUser };

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cludinary.js";
import {  ApiResponse} from "../utils/ApiResponse.js";

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
    const avtarLocalPath = req.files?.avatar[0]?.path; // ? is a show option
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;


    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage[0]?.path)

    // step 4.1: check if avatar file exists
    if (!avtarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // step 5: upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // step 5.1: check if avatar upload failed
    if (!avatar) {
        throw new ApiError(400, "Avatar file upload failed");
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

export { registerUser };





