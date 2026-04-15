import mongoose from "mongoose";

const runSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  distance: Number,
  duration: Number,
  steps: Number,
}, { timestamps: true });

const Run = mongoose.model("Run", runSchema);
export default Run;