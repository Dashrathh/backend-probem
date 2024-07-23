
import mongoose, { isValidObjectId } from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Comment } from "../models/commnet.models.js"
import { Video } from "../models/video.model.js";

const getVideoComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id id not valid");
    }
    const skip = (page - 1) * limit 
  
    const comment  = await Comment.find({video:videoId})
    .skip(skip).limit(limit)

      if(!comment || comment.length === 0){
        throw new ApiError(400, "comment not found")
      }   

      return res.status(200).json(new ApiResponse(201),comment ,"comment found successfully")
    })

    
    //  add comment to video
     const addComment = asyncHandler(async(req,res) =>{


        const {videoId} = req.params;
        const {content} = req.body

        if(!isValidObjectId(videoId)){

            throw new ApiError(400, "Invalid videoId")
        };

        const newcomment = await Comment.create({
            video:videoId,
            content:content
        })

        if(!newcomment){
            throw new ApiError(400, "comment not created")
        }
        return res.status(200).json(new ApiResponse(201),newcomment,"Comment add successfully")
     });

//   Fetch comment using aggregation pipeline
  
     

const upadateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw ApiError(400, "content not found")
    }

    const upadatingComment = await Comment.findByIdAndUpdate(
        commentId, 
        {content:content},
        {new:true}
    );

    if (!upadatingComment) {
        throw new ApiError(400, "commnet not upadated")
    }
    return res.status(200).json(new ApiResponse(200, upadatingComment, "upadating comment successfully"))
})


//  deleting comment


const deletingComment = asyncHandler(async (req, res) => {

    const {commentId} = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if (!deletedComment) {
        throw new ApiError(400, "Comment not deleted")
    }
    return res.status(200).json(new ApiResponse(201), deletedComment, "Comment delete successfully")
})

export {
    getVideoComment,
    addComment,
    upadateComment,
    deletingComment
}