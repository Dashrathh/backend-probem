import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cludinary.js";
import { Video } from "../models/video.model.js";



// step : 
// 1 : get All vedio
// 2: publish vedio
// 3: get single vedio
// 4: updateVideo   //  upate vedio  detail like title description, thumbnail
// 5:delete Video
// 6:toggle PublishStatus

const parseDuration = (duration) => {
    const match = duration.match(/(\d+)/); // Extract the number from the string
    return match ? parseInt(match[1], 10) : null; // Convert the matched number to an integer
};

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

   return res.status(200).json(new ApiResponse(200), videos, "All video fetched successfully")

});

// ============   Publish videos ==============

const publishVideos = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body

    const videoLocalPath = req.files?.videoFile?.[0]?.path; 

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!title) {
        throw new ApiError(400, "titile is not avalable")
    }

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file missing")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is missing")
    }

    const PUBvideo = await uploadOnCloudinary(videoLocalPath)
    const PUBthumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    //  entry in db

    const newVideo = await Video.create({
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

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {

        throw new ApiError(404, "video is not avalable")
    }
    return res.status(200).json(new ApiResponse(200), {video}, "Video is found")
})


//    upadte video details like title , description ,thumbnail

const upadateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    let updatedData = { title, description };

    if (thumbnailLocalPath) {
        const PUBthumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        updatedData.thumbnail = PUBthumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updatedData, { new: true });

    if (!updatedVideo) {
        throw new ApiError(400, "Video update failed");
    }

    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

//  5:delete Video

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findByIdAndDelete(videoId);

    if (!deleteVideo) {
        throw ApiError(400, "Video not deleted")
    }

    return res.status(200).json(new ApiResponse(201), deleteVideo, "video delete successfully")
})


export {
    getAllVideos,
    publishVideos,
    getVideoById,
    upadateVideo,
    deleteVideo

}
