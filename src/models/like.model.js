
import mongoose ,{Schema} from "mongoose";

const likeSchema = new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"video"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    },
}, {timestamps:true})

export const Like = mongoose.model("Like",likeSchema)