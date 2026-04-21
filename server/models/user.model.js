import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age:{type:Number},
    weight:{type: Number},
});

const User = mongoose.model("User", userSchema);
export default User;