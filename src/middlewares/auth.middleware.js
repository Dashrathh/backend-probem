
// this middleware do verify user he ki nahi hai bas

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    
try {
     const token  = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer "," ")
    
     // ya to cookies thi accessToken lavo ya fir costom header throw lAVO
    
    
     if (!token) {
    
        throw new ApiError(401 , "Unauthorize request")
        
     }
    
        const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
           
        
         // data base id connection
    
       const user =  await User.findById(decodedToken?._id).select(
            "-password  - refreshToken"
        )
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
            
        }
     
        
    
        //  req ni andar ek naya object add kar dete hai
    
        req.user = user;
        next();
    
                 
    
} catch (error) {
    throw new ApiError(402, error?.message ||"Invalid access token" )
}

})