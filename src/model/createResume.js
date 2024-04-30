import mongoose from "mongoose";


let resumetemSchema = new mongoose.Schema({
    resumeid:{
        type:String,
        required:[true,"Id is required"]
    },
    image:{
        type:String,
        required:[true,"Image is required"]
    },
    content:{
        type:String,
        required:[true,"Content is required"]
    },
    status:{
        type:Boolean,
        default:true
    }
},
    {
    collection:"resumetem",
    versionKey:false
    }
)

const resumetempModel = mongoose.model("resumetem",resumetemSchema)

export default resumetempModel