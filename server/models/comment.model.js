import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    user:{
        typr: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text: String
},{
    timestamps:true
})
export default mongoose.model("Comment", commentSchema);