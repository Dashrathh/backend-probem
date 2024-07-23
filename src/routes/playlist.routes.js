import { Router } from "express";
import{
    createPlaylist,
    addVideoToPlaylist,
    getPlaylistByid,
    getUserPlaylist,
    removeVideoFromPlaylist,
    upadatePlaylist,
    deletePlaylist
    
} from "../controllers/playlist.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT)

router.route("/create").post(createPlaylist)
router.route("/:playlistId").get(getPlaylistByid)
router.route("/:playlistId").patch(upadatePlaylist)
router.route("/:playlistId").delete(deletePlaylist)

//  user playlist
router.route("/user/:userId").get(getUserPlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)

router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

export default router;