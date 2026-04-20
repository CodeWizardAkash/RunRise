import express from "express";
import Run from "../models/Run.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

//Add run
router.post("/", auth, async(req, res)=>{
    try{
        const run = await Run.create({
            ...req.body,
            userId: req.user.id,
        });
        res.status(201).json(run);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

//Get run
router.get("/", auth, async (req, res)=>{
    try{
        const runs = await Run.find({userId: req.user.id});
        res.json(runs);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

export default router;