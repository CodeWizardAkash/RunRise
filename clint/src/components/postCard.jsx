import CommentSection from "./CommentSection";

function PostCard({ post, handleLike }) {
  return (
    <div className="bg-zinc-900 text-white p-4 rounded mb-5">

      <h2 className="font-bold text-lg">
        {post.user?.name}
      </h2>

      <p className="mt-2">
        {post.caption}
      </p>

      <div className="mt-3">
        🏃 {post.run?.distance} KM
      </div>

      <div>
        ⏱{" "}
        {Math.floor(
          (post.run?.duration || 0) / 60
        )}{" "}
        mins
      </div>

      <hr className="border-t-2 border-gray-700 my-4 mt-5" />
      <button
        onClick={() => handleLike(post._id)}
        // className="mt-3"
      >
        ❤️ {post.likes.length}
      </button>

      <CommentSection postId={post._id} />
    </div>
  );
}

export default PostCard;