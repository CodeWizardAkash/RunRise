import express from "express";

import {saveRun, getRuns} from "../controllers/runController.js"
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/", protect, saveRun);
router.get("/", protect, getRuns);

export default router;