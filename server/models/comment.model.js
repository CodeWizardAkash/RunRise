import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true,
    },
    text:{
        type: String,
        require: true
    }
},{
    timestamps:true
})
export default mongoose.model("Comment", commentSchema);