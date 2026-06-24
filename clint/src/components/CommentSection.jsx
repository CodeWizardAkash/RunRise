import { useState } from "react";
import API from "../services/api"

function CommentSection({postId}){
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [text, setText] = useState("");

    const fetchComments = async () =>{
        try{
            const res = await API.get(`/posts/${postId}/comment`);
            setComments(res.data);
        }catch(error){
            console.log(error);
        }
    }

    const toggleComments = async ()=>{
        if(!showComments){
            await fetchComments();
        }
        setShowComments(!showComments);
    }

    const handleComment = async () =>{
        if(!text.trim()) return;

        try{
            await API.post(`/posts/${postId}/comment`, {
                text,
            });
            text="";
            await fetchComments()
        }
        catch(error){
            console.log(error);
        }
    }

    return (
    <div className="mt-3 text-white">
      <button
        onClick={toggleComments}
        className="text-blue-500"
      >
        💬 Comments
      </button>

      {showComments && (
        <div className="mt-3 text-white">
           <div className="flex gap-2 mb-5">
            <input
              type="text"
             
              placeholder="Write a comment..."
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              className="flex-1 outline-none border border-gray-400 rounded px-3 py-2"
            />

            <button
              onClick={handleComment}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Post
            </button>
          </div> 

          <div className="space-y-2 mb-3">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-zinc-500 p-2 rounded"
              >
                <p className="font-semibold">
                  {comment.user?.name}
                </p>

                <p>{comment.text}</p>
              </div>
            ))}
          </div>

          
        </div>
      )}
    </div>
  );
}

export default CommentSection;