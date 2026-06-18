import Post from "../models/post.model.js"

// create post
export const createPost = async(req, res)=>{
    console.log("CREATE POST HIT");
    try{
        const post = await Post.create({
            user:req.user.id,
            run:req.body.runId,
            caption: req.body.caption
        });
        res.status(201).json(post);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

//Get Feed
export const getFeed = async(req, res)=>{
    try{
        const posts = await Post.find()
            .populate("user","name")
            .populate("run")
            .sort({createdAt:-1});
        res.status(200).json(posts);    
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

//Like controller
export const likePost = async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                message: "Post not found"
            });
        }
        const alreadyLiked = post.likes.includes(
            req.user.id
        );

        if(alreadyLiked){
            post.likes = post.likes.filter(
                id=> id.toString() !== req.user.id
            );
        }else{
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({
            likes:post.likes.length
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}