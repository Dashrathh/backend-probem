import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
})) 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))   // static work file folder store
app.use(cookieParser())



// routes   means rasta

import userRouter from './routes/user.routes.js'

// routes declaration

app.use('/api/v1/users', userRouter);
 // Use the user routes
  // this is middleware here use (/user , userRoute means kon sa router export karana he)

// http://localhost:8000/api/v1/users/register



export { app }
