import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth.route.js";
import run from "./routes/run.route.js"
import userRoute from "./routes/user.route.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Welcome to RunRise !");
})

app.use("/api/auth", auth);
app.use("/api/run", run);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server listion on port: ${PORT}`);
})

mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    console.log("MONGO_DB CONNECTED!!");
 })
 .catch(err => console.log(err));