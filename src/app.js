import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
import userRouter from './routes/user.routes.js'
import videoRouter  from './routes/video.routes.js'
import  subscriptionRouter  from "./routes/subscription.routes.js"
import commentRouter  from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/twitter.route.js"
import playlistRouter from "./routes/playlist.routes.js"



app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
})) 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))   // static work file folder store
app.use(cookieParser())



// routes   means rasta


// routes declaration

app.use('/api/v1/users', userRouter); 
 // Use the user routes
  // this is middleware here use (/user , userRoute means kon sa router export karana he)

  //  video routes
app.use('/api/v1/videos',videoRouter );
app.use("/api/v1/comments", commentRouter )
app.use("/api/v1/likes", likeRouter )
app.use('/api/v1/subscription',subscriptionRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/playlist', playlistRouter)

 



export { app }
