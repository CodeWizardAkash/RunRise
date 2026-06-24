import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/postCard";
import API from "../services/api";


function Feed(){
    const navigate = useNavigate();

    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        fetchFeed();
    },[]);


    const fetchFeed = async()=>{
        try{
            const res = await API.get("/posts");

            setPosts(res.data);

        }catch(error){

            console.log(error);
        }
    };

    const handleLike = async(postId)=>{
        try{
            await API.put(`/posts/${postId}/like`);

            fetchFeed();

        }catch(error){
            console.log(error)
        }
    }

    return(

        <div className="p-5">
            <div
                className="cursor-pointer text-left"
                onClick={() =>navigate("/dashboard")}
            >{"<< back"}</div>

            <h1 className="text-3xl font-bold mb-5">
                Community Feed
            </h1>

            {posts.map((post) => (
                <PostCard
                key={post._id}
                post={post}
                handleLike={handleLike}
                />
            ))}
        </div>
    );
}

export default Feed;