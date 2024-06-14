
import mongoose, { isValidObjectId } from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Comment } from "../models/commnet.models.js"
import { Video } from "../models/video.model.js";

const getVideoComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (page * 10) - limit


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id id not valid");
    }
    const pipeline = [
        {
            $match: {
                owner: videoId
            }
        }, {
            $skip: skip
        },
        {
            $limit: limit
        }
    ];

})

//   Fetch comment using aggregation pipeline
const getAllcomment = asyncHandler(async (req, res) => {

    const getComments = await Comment.aggregate(pipeline);

    if (!getComments) {
        throw new ApiError(400, "comment not founded")
    }
    return res.status(200).json(new ApiResponse(200), fivideo, "Video found successfully")

})


//  upadate document

const upadateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const { content } = req.body;

    if (!content) {
        throw ApiError(400, "content not found")
    }

    const upadatingComment = await Comment.findByIdAndUpdate(commentId, {
        content
    },
        { new: true })

    if (!upadatingComment) {
        throw new ApiError(400, "commnet not upadated")
    }
    return res.status(200).json(new ApiResponse(200, upadatingComment, "upadating comment successfully"))
})


//  deleting comment


const deletingComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const deleteCom = await Comment.findByIdAndDelete(commentId)

    if (!deleteCom) {
        throw new ApiError(400, "Comment not deleted")
    }
    return res.status(200).json(ApiResponse(201), deleteCom, "Comment delete successfully")
})


export {
    getVideoComment,
    getAllcomment,
    upadateComment,
    deletingComment
}