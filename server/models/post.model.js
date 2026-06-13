import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    run:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Run"
    },
    text:{
        type: String,
        default:""
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},{
    timestamps: true
})

export default mongoose.model("Post", postSchema);