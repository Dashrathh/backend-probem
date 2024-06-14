
import mongoose,{isValidObjectId} from "mongoose"
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";


// toggle like on video
// toggle like on comment
// toggle like on tweet
// get all liked videos



const toggleviedoLike  = asyncHandler(async(req,res) =>{
    const {videoId} = req.params
    
    const {userid}  = req.user_id

    if(!isValidObjectId(videoId)){
        throw new  ApiError(404 ,"video id not found");
    }

    const video= Video.findById(videoId, userid)
    
    if(!video){
        throw ApiError(404, "video not found")
    }
     
    //  toggle 

    video.Like = !video.Like
    await video.save()
})
 