import mongoose from "mongoose";

const runSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    distance:{
        type:Number,
        required:true
    },

    duration:{
        type:Number,
        required:true
    },

    speed:{
        type:Number,
        default:0
    },
    pace:{
      type:Number,
      default: 0
    },
    route:[
      {
        lat:Number,
        lon: Number,
      }
    ]

}, { timestamps: true });

export default mongoose.model("Run", runSchema);