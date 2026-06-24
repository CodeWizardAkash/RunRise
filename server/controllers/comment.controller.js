import Comment from "../models/comment.model.js"

export const createComment = async (req, res)=>{
    try{
        const comment = await Comment.create({
            post: req.params.id,
            user: req.user.id,
            text: req.body.text
        })
        res.status(201).json(comment);

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

export const getComment = async (req, res) =>{
    try{
        const comments = await Comment.find({post: req.params.id})
            .populate("user", "name")
            .sort({createdAt:-1});
        
        res.status(200).json(comments);  

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}