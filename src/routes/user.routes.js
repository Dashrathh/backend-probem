import { Router } from "express";
import {
   changeCurrentPassword,
   getCurrentUser,
   getUserChannelProfile,
   loginUser,
   logoutUser,
   registerUser,
   updateAccountDetails,
   updateUserAvatar,
   updateUserCoverImage,
   getWatchHisory
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middleware.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
   upload.fields([
      {
         name: "avatar",
         maxCount: 1
      },
      {

         name: "coverImage",
         maxCount: 1
      },
   ]),
   registerUser)



router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJWT, logoutUser)

// here router are do route  method with use post (logout) .(verifying middleware before logoutUser )
router.route("/refresh-token").post()

router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)  // here use .patch perticular detail he upadate hoti he

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHisory)

export default router
