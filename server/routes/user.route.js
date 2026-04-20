import express from "express";
import auth from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/profile", auth, async (req, res)=>{
    try{
       const user = await User.findById(req.user.id).select("-password");
        res.json(user); 
    }catch(err){
        res.status(400).json({message: err.message});
    }    
});

export default router;