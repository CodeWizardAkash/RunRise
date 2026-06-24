import express from "express";
import protect from "../middleware/auth.middleware.js"
import { createPost, getFeed, likePost } from "../controllers/post.controller.js";
import { createComment, getComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getFeed);
router.put("/:id/like", protect, likePost);

router.post("/:id/comment", protect, createComment);
router.get("/:id/comment" , protect, getComment);

export default router;