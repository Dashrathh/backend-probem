import { Router } from "express";

import {
    getLikeVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike
} from "../controllers/like.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Like } from "../models/like.model.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikeVideos);


export default router;