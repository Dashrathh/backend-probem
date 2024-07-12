

import mongoose, {isValidObjectId} from "mongoose"

import { User } from "../models/user.model.js"
import { subscription } from "../models/subscription.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
// import { isValidObjectId } from "mongoose"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    const  userId  =  req.user?._id
    
    console.log("channelIDD:" ,channelId);
    //  toggle subscription

    if (!isValidObjectId(channelId)) {
        console.error("InvalidChannel  ID:",channelId )

        throw new ApiError(400, "Invalid channel ID")
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const subscriptioncheck = await subscription.findOne({

        channel: channelId,
        subcriber: userId
    })

    if (subscriptioncheck) {
        // unscrubed
        await subscriptioncheck.deleteOne()
        return res.status(200).json(new ApiResponse(200), subscriptioncheck, "subscription remove successfully")
    }

    else {
        //  subscribe
        const creatSubscription = await subscription.create(
            {
                channel: channelId,
                subcriber: userId
            })
        return res.status(200).json(new ApiResponse(200), creatSubscription, "subscription creat successfully you subcribed channel")
    }

})

// controller to return subscriber list of a channel


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel  id")
    }
    const subscribers = await subscription.find({ channel: channelId }).populate("subscriber", "fullName email username avatar coverImage");
    return res.status(200).json(new ApiResponse(200, { subscribers }, "Subscribers are fetched successfully"))
})


// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscribe id");
}

    const subribechannel = await subscription.find({ subcriber: subscriberId }).populate({ subcriber: subscriberId })
    return res.status(200).json(new ApiResponse(201), subribechannel, "Subscribed channel fetched successfully")
});



export {
    toggleSubscription,
    getUserChannelSubscribers, 
    getSubscribedChannels
}

