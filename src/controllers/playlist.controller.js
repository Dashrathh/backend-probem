import mongoose, { isValidObjectId } from "mongoose";

import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//TODO: create playlist

const createPlaylist = asyncHandler(async (req, res) => {
    const {name,description} = req.body;

    if(!name || !description){
        throw new ApiError(400, "Name and description required")
    }
// if(!isValidObjectId(name,description)){
//     throw new ApiError(400,"object id is not valid")
// }
    const chekplaylist = await Playlist.findOne({
        name,
        description,
    });
    if (chekplaylist) {
        throw new ApiError(403, "playlist already exists")
    }
    
    const playlistCreated = await Playlist.create({
        name,
        description,
        user: req.user._id
    })

    return res.status(200).json(new ApiResponse(201), playlistCreated, "playlistCreated successfully")

});


//  get user playlist

const getUserPlaylist = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    if (!isValidObjectId) {
        throw new ApiError(400, "object id is not valid")
    }

    const playlist = await Playlist.find({
        user: userId
    })

    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    return res.status(200).json(new ApiResponse(200), playlist, "Playlist create successfully")
})

//  get playlist by id

const getPlaylistByid = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId) {
        throw new ApiError(404, "Object id is invalid")
    }
    const playlistByid = await Playlist.findById(playlistId)

    if (!playlistByid) {
        throw new ApiError(404, "playlist not found")

    }
    return res.status(200).json(new ApiResponse(201), playlistByid, "playlist found successfully")
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;


    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "playlist and video Id is not valid")
    };

    const addVideoInplaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
           $push:{videos:videoId},
        },
        {
            new: true
        }
    )

    if (!addVideoInplaylist) {
        throw new ApiError(404, "video not upadate successfully")
    }
    return res.status(201).json(new ApiResponse(201), addVideoInplaylist, "playlist upadate successfully")
})


//   remove video from playlist

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId,videoId} = req.params;

    if(!isValidObjectId(playlistId)|| !isValidObjectId(videoId)){
        throw new ApiError(404, "playlist id or video id is not valid")
    }
    
    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull:{videos:videoId}
        },

        {
            new: true
        }
    );

    if(!playlist){
        throw new ApiError(404, "playlist not updated")
    }

    return res.status(200).json(new ApiResponse(201),playlist,"playlist update successfully")

})

//  update playlist

   const upadatePlaylist = asyncHandler(async(req,res) =>{
    const {playlistId} = req.params;
   
    const{name,description} = req.body;

    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            name:name,
            description:description,
        },
        {new :true}
    )

    if(!playlist){
        throw new ApiError(401,"playlist not upadate successfully")
    }

    return res.status(201).json(new ApiResponse(200),playlist,"playist upadate successfully")
   })


//  delete playlist

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Playlist id not found object id is not valid")
    }
    const playlistdelete = await Playlist.findByIdAndDelete(playlistId)

    if (!playlistdelete) {
        throw new ApiError(404, "playlist not deleted")

    }

    return res.status(201).json(new ApiResponse(200), playlistdelete, "playlist delete successfully")
})


export {
    createPlaylist,
    getUserPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylistByid,
    upadatePlaylist

}