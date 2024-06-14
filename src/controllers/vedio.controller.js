import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cludinary.js";
import { Video } from "../models/video.model.js";
import { application, json } from "express";
import { set } from "mongoose";


// step : 
// 1 : get All vedio
// 2: publish vedio
// 3: get single vedio
// 4: updateVideo   //  upate vedio  detail like title description, thumbnail
// 5:delete Video
// 6:toggle PublishStatus

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, userId } = req.query
    // lest break down all page: represent pagenumber
    // limit: max page limit 
    //  sort : sort represent field by which the result should be sorted
    // sortType : represent the order in which result shoul be sorted(acending or descending)

    const pagenumber = Number(page);
    const limitNumber = Number(limit)

    // Build query object

    let query = {};
    if (userId) {
        query.user = userId
    }

    // Build sorting object
    let sort = {};
    if (sortBy) {
        sort[sortBy] = sortType === 'dec' ? -1 : 1
    }

    //  Fetch video with pagination and sorting

    const videos = await Video.find(query)
        .sort(sort)
        .skip((pagenumber - 1) * limitNumber)
        .limit(limitNumber)

    res.status(200).json(ApiResponse(200), videos, "All video fetched successfully")

});
    
// ============   Publish videos ==============

    const publishVideos = asyncHandler(async (req, res) => {
        const { title, description, duration } = req.body


        const vedioLocalPath = (req.file.videoFile) && req.file.videoFile[0]?.path
        const thumbnailLocalPath = (req.file.thumbnail) && req.file.thumbnail[0]?.path

           if(!title){
            throw new ApiError(400, "titile is not avalable")
           }

        if (!vedioLocalPath) {
            throw new ApiError(400, "Video file missing")
        }

        if(!thumbnailLocalPath){
            throw new ApiError(400,"thumbnail is missing")
        }

        const PUBvideo = await uploadOnCloudinary(vedioLocalPath)
        const PUBthumbnail  = await uploadOnCloudinary(thumbnailLocalPath)
    
        //  entry in db

    const newVideo = await new vedio.creat({
        title,
        description,
        videoFile: PUBvideo.url,
        thumbnail: PUBthumbnail.url, 
        duration,
        owner: req.userId

    })

    return res.status(200).json(
        new ApiResponse(200, newVideo, "Video creat  and upload successfully")
    )
    
})


//   get video from id 

      const getVideoById = asyncHandler(async(req,res) =>{
        const {videoId} = req.params
        const video =  await Video.findById(videoId)
        if(!video){
            throw ApiError(404, "video is not avalable")
        }
        res.status(200).json(ApiResponse(200), video,"Video is found")
      })

        
    //    upadte video details like title , description ,thumbnail

    const upadateVideo = asyncHandler(async(req,res) =>{
        const {videoId} = req.params 
        const {title, description} = req.body

        const thumbnailLocalPath = req.file?.thumbnail?.[0].path;

       let thumbnail ;
        if(thumbnailLocalPath){
            const PUbthumbnail = await uploadOnCloudinary(thumbnailLocalPath)
             thumbnail = PUbthumbnail.url
        }
        const updation = await Video.findByIdAndUpdate(
            req.Video?._id,
            {
                $set:{
                  description,
                  title,
                  thumbnail
                }
            },
            {new: true}
        );

        if(!upadateVideo){
            return ApiError(400, "Video not updated")
        }

        return res.status(201).json(ApiResponse(200 ,upadateVideo, "video file upadted successfully" ))
    })
      

    //  5:delete Video
   
    const deleteVideo = asyncHandler(async(req,res) =>{
        const {videoId } = req.params

        const deletevideo = Video.findByIdAndDelete(videoId)

        if(!deleteVideo){
            throw ApiError(400,"Video not deleted")
        }

        return res.status(200).json(ApiResponse(201), deleteVideo, "video delete successfully")
    })


export {
    getAllVideos,
    publishVideos,
    getVideoById ,
    upadateVideo,
    deleteVideo

}
