import { Router } from 'express';
import {
    addComment,
    deletingComment,
    getVideoComment,
    upadateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComment)

router.route("/:videoId").post(addComment);

router.route("/:commentId").delete(deletingComment)

router.route("/:commentId").patch(upadateComment)


export default router