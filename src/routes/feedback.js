import express from "express";
import { varifyAccessToken } from "../helper/jwt.js";
import { feedbackList, addFeedback } from "../controllers/feedback.js";
import { addFeedbackValidator } from "../validators/feedback.js";

const router = express.Router();

router.get("/feedback", varifyAccessToken, feedbackList);
router.post("/feedback", addFeedbackValidator, addFeedback);

export default router;
