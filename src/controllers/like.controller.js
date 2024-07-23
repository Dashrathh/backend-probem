
import mongoose,{isValidObjectId} from "mongoose"
// import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";


// toggle like on video
// toggle like on comment
// toggle like on tweet
// get all liked videos


// toggle like on video


const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!isValidObjectId){
        throw new ApiError("404", "object id is not valid")
    }

    // already like video find

    const likedVideo = await Like.findOne({
        video:videoId,
        user:req.user.id
    });

    
        if(likedVideo){
           const unlike =  await Like.deleteOne({
               video:videoId,
               user: req.user.id

            })
            if(!unlike){
               throw new ApiError(402, "error while video unlike")
            }
            return res.status(200).json(new ApiResponse(201,"Video unlike successfully"))

        }

        if(!likedVideo){
           const like =  await Like.create({
             video:videoId,
             like:req.user.id
            })

            if(!like){
                throw new ApiError(404, "error while video like")
        }
        
        }
         return res.status(201).json(new ApiResponse(201, "Video like successfully"))
    });


    // toggle like on comment

    const toggleCommentLike = asyncHandler(async (req, res) => {
        const {commentId} = req.params;
        
    if(!isValidObjectId){
        throw new ApiError("404", "object id is not valid")
    }

    //   if comment like already

    const likedComment = await Like.findOne({
        comment:commentId,
        user:req.user.id
    })

    if(likedComment){
        const unlike = await Like.deleteOne({
            commentId,
            user:req.user.id
        })
        if(!unlike){
            throw new ApiError(404,"error while video unliking")
        }
        return res.status(200).json(new ApiResponse(200, "commet unlike successfully"))
    }
              
    else{
        const like = await Like.create({
            commentId,
            user:req.user.id
        })
    }
    return res.status(200).json(new ApiResponse(201, "comment like successfully"))
    })

    //  Togggle tweet

    const toggleTweetLike = asyncHandler(async (req, res) => {
        const {tweetId} = req.params

        if(!isValidObjectId){
 
            throw new ApiError(404, "Throw new Api error ")
        }

        const likedTweet = await Like.findOne({
           tweet: tweetId,
           user:req.user.id,
        });

        if(likedTweet){
            const unlike  = await Like.deleteOne({
                tweet:tweetId,
                user:req.user.id
            });

            if(!unlike) {
                throw new ApiError(404 , "Error while unlike tweet")
            }
            return res.status(200).json(new ApiResponse(201, "unlike video successfully"))
        }

        else{
            const like = await Like.create({
                tweet: tweetId,
                user:req.user.id
            });

            if(!like){
                throw new ApiError(404, "Error while like tweet")
            }
            
        }
        return res.status(201).json(new ApiResponse(201, "tweet like successfully"))
    })




//  get all liked  video 


     const getLikeVideos = asyncHandler(async(req,res) =>{


        const Likedvideos = Like.find({
            user:req.user.id,
            video:true
        })
        
        if(!Likedvideos){
            throw new ApiError(404, "Liked video not found")
        }
        return res.status(200).json(new ApiResponse(201,"get liked video successfully"))

    });
        

    export{
        toggleVideoLike,
        toggleCommentLike,
        toggleTweetLike,
        getLikeVideos

        
    }
    

    
 