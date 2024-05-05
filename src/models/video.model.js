
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new Schema(
    {
        videoFile: {
            type: String ,// clodinary
            required :true
        },
        thumbnail: {
            type: String ,// clodinary
            required :true
        },
        title: {
            type: String ,// clodinary
            required :true
        },
        description: {
            type: String ,// clodinary
            required :true
        },
        duration: {
            type: Number,
            required :true
        },
        views:{
            type: Number,
            default: 0
        },
        isPublished :{
            type: Boolean,
            default: true
        },
        owner: {
            type :Schema.Types.ObjectId,
            ref: "User"
        }
    },
    

    {
        timestamps :true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("video",videoSchema)