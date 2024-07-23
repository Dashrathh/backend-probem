import mongoose ,{isValidObjectId} from "mongoose"
import { Tweet } from "../models/tweer.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


//  create tweet 

const createTweet = asyncHandler(async(req,res) =>{

    const {content} = req.body;

    const user = req.user.id;

    const tweetCreate = await Tweet.create({
        content:content,
        user:user
    })
    return res.status(200).json(new ApiResponse(201,tweetCreate,"tweet create successfully"))
})

    // TODO: get user tweets

    const getUserTweets = asyncHandler(async(req,res) =>{
        const {tweetId} = req.params;

        const {userid} = req.user.id;

        const getTweet = await Tweet.find({
            tweetId,
            user:userid
        })
        if(!getTweet){
            throw new ApiError(404,"twitter not found")
        }
        return res.status(201).json(new ApiResponse(200,getTweet,"get user tweet successfully"))
    })

        // TODO: update  user tweets

         const updateTweet = asyncHandler(async(req,res) =>{
            const {content} = req.body;
            const{tweetId} = req.param;

            const update = await Tweet.findOneAndUpdate({
                _id:tweetId,
                content,
                new : true
            
            })
            if(!update){
                throw new ApiError(404, "tweet not upadated")
            }
            return res.status(201).json(new ApiResponse(200,update,"tweet update successfully "))
         })

        //  deletedTweet

        const deleteTweet = asyncHandler(async(req,res) =>{
            const{tweetId} = req.param;

            const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
            
            if(!deleteTweet){
                throw new ApiError(404,"tweet not deleted")
            }

            return res.status(200).json(new ApiResponse(201,deleteTweet, "tweet deleted successfully"))
        });

export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}