import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
                onClick={() =>
                navigate("/dashboard")
                }
            >
                {"<< back"}
            </div>

            <h1 className="text-3xl font-bold mb-5">
                Community Feed
            </h1>

            {
                posts.map((post)=>(
                    <div
                        key={post._id}
                        className="bg-zinc-900 p-4 rounded mb-4 text-white"
                    >
                        <h2>{post.user?.name}</h2>

                        <p>{post.caption}</p>

                        <p>🏃 {post.run?.distance} KM</p>

                        <button
                            onClick={() => handleLike(post._id)}
                            className="bg-white text-black mt-6 p-1 w-16 rounded-2xl"
                        >
                            ❤️ {post.likes.length}
                        </button>
                    </div>
                ))
            }

        </div>
    );
}

export default Feed;