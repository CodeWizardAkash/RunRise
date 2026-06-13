import Run from "../models/Run.model.js"

// Save Run
export const saveRun = async (req, res)=>{
    try{
        const newRun = await Run.create({
            user: req.user.id,
            distance: req.body.distance,
            duration: req.body.duration,
            speed: req.body.speed,
            pace: req.body.pace,
            route: req.body.route
        });
        res.status(201).json({
            success:true,
            run: newRun
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Get User Runs;
export const getRuns = async(req, res)=>{
    try{
        const runs = await Run.find({
            user:req.user.id
        }).sort({createdAt:-1});

        res.status(200).json(runs);
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}