

import mongoose, { isValidObjectId } from "mongoose"

import { User } from "../models/user.model.js"
import { subscription } from "../models/subscription.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id

    console.log("channelIDD:", channelId);
    //  toggle subscription

    if (!isValidObjectId(channelId)) {
        // console.error("InvalidChannel  ID:", channelId)

        throw new ApiError(400, "Invalid channel ID")
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "channel not found")
    }

    const subscriptioncheck = await subscription.findOne({
        channel: channelId,
        subcriber: userId
    });

    if (subscriptioncheck) {
        // unscrubed
        const unscribed = await subscription.findByIdAndDelete(subscriptioncheck._id)

        return res.status(200).json(new ApiResponse(200), unscribed, "subscription remove successfully")
    }

    else {
        //  subscribe
        const creatSubscription = await subscription.create(
            {
                channel: channelId,
                subcriber: userId
            })
        return res.status(200).json(new ApiResponse(200, creatSubscription, "subscription creat successfully you subcribed channel"))
    }

});

// controller to return subscriber list of a channel

/* here aggreagtion is :Aggregate query to get channel list of a subscriber (user){user ne kitani channel k subscribe kiya he uska list} and 
    also the count of subscribers for each channel in this array { us particular channel ko kitane user ne subscribe kiya hai} of 
   
*/

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel  id")
    }

    const subscribers = await subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subsriber",
                foreignField: "_id",
                as: "subscriber"
            }
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber" }
            }

            /*  lookup stage creates an array of subscribers (even if there's 
            only one subscriber), $first: "$subscriber" is used to convert this array 
            into a single object by taking the first element of the array. This ensures that the subscriber
             field is a single object instead of an array of one object.
             */
        },
        {
            $project: {
                _id: 0,   //Hide the _id field from Subscription document
                'subscriber.id': 1,
                'subscriber.username': 1,
                'subscriber.fullname': 1,
                'subscriber.email': 1

            }
        }
    ])

    if (!subscribers.length) {
        throw new ApiError(404, "no subscriber found in this channel")
    }

    return res.status(200).json(
        new ApiResponse(201, subscribers, "subscriber fetched successfully")
    )

})


// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const {subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscribe id");
    }

    const subcribedChennel = await subscription.aggregate([
        {
            $match: {
                subcriber: new mongoose.Types.ObjectId(subscriberId)
            },
        },
        
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel"

            }
        },

        
        {
            $unwind: "$channel" // Unwind the array to get channel objecr directly
        },
        {
            $project:{
                _id: 0,
                'channel._id': 1,
                'channel.username': 1,
                'channel.fullname': 1,
                'channel.email': 1,
                'channel.avatar': 1,
                'channel.coverImage': 1
            }
        }
    ]);

    if (!subcribedChennel.length) {
        throw new ApiError(400, "subscribedChannel not found")
    }

    return res.status(200).json(new ApiResponse(200, subcribedChennel, "subscribed channel fetched successfully"))

});



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}

