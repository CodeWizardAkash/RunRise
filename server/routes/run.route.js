import express from "express";
import Run from "../models/Run.model.js";

const router = express.Router();

//Add run
router.post("/", async(req, res)=>{
    try{
        const run = await Run.create(req.body);
        res.json(run);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

//Get run
router.get("/", async (req, res)=>{
    try{
        const runs = await Run.find();
        res.json(runs);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

export default router;