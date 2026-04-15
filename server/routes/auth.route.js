import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/registor", (req, res)=>{
    res.send("ok");
})

router.post("/registor", async (req, res)=>{
    try{
        const {name, email, password, age, weight} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            weight,
        })
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/login", async (req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({message: "Something is wrong try again !!"});
        

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.json({token});
        
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}); 

export default router;