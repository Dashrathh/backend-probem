import { Router } from "express";

import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const subscription = Router()
    
subscription.route('/toggle/:channelId').post(toggleSubscription);

subscription.route('/subscribers').get(getUserChannelSubscribers);

subscription.route('./subscriptions').get(getSubscribedChannels);


export default subscription;