

import mongoose , {Schema} from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
 {
      username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true
      },
      email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      fullname:{
        type: String,
        required: true,
        trim: true,
      },
      avatar:{
        type: String, // cloudinary url
        require:true,
      },
      coverImage:{
        type: String,
        
      },
      watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String
    }
},
{
    timestamps: true
}

)

userSchema.pre("save", async function (next) {   // pre after ("save is event means what he do work")

  if(! this.isModified("password")) return next();  // if password not modified so return next meand direct bahar 

  this.password  = await bcrypt.hash(this.password, 10)  // here 10 is round
  next() 



  /*
  userSchema.pre("save", async function (next) {
  // if(! this.isModified("password")) return next(){

    this.password  = bcrypt.hash(this.password, 10)  

    else{
 next()
    }
 
  } 
   
  */

}) 

userSchema.method.isPasswordCorrect = async function
(password){
 
 return await bcrypt.compare(password, this.password)


}
userSchema.method.generateAccessToken = function(){
  jwt.sign(
    {
      _id: this._id,
      email : this.email,
      userSchema: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET,
    }
  )
}
userSchema.method.generateRefreshToken = function(){
  jwt.sign(
    {
      _id: this._id,
      email : this.email,
      userSchema: this.username,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET,
    }
  )
}

export const User  =  mongoose.model("User",userSchema)