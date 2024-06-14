import { Router } from "express";

import {
    getAllVideos,
    publishVideos,
    getVideoById,
    upadateVideo,
    deleteVideo
} from '../controllers/vedio.controller.js'

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import router from "./user.routes.js";

const videoRouter = Router()

// router.use.verifyJWT()

//  Routes all video

videoRouter.route('/getvideos').get(getAllVideos)

//Routes Publish a video

videoRouter.route('/video').post(
    verifyJWT,
    upload.fields([

        {
        name: "videoFile",
        maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1
        }

    ])
    , publishVideos);


    // routes to get videp by ID

videoRouter.route('/videos/:videoId').get(getVideoById)

//  Routes to get update video

videoRouter.route('/video/:videoId').patch(
    verifyJWT,
    upload.single('thumbnail'),
    upadateVideo
);

//  Routes to delete video

videoRouter.route('/video/:videoId').delete(deleteVideo)

export default videoRouter 