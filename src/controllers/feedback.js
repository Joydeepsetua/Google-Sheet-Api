import { insertFeedback, fetchFeedbackList } from "../sheets/services/feedback.js";

const addFeedback = async (req, res, next) => {
    try {
        const feedback = await insertFeedback(req.body);
        res.status(200).json({
            status: 200,
            message: "Thank you! Your feedback is valuable to us and helps us improve.",
            data: feedback,
        });
    } catch (error) {
        next(error)
    }
}

const feedbackList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const feedbacks = await fetchFeedbackList(page, limit);
        res.status(200).json({
            status: 200,
            message: "Fetch successfully",
            data: feedbacks.data,
            pagination: feedbacks.pagination,
        });
    } catch (error) {
        next(error)
    }
}


export { addFeedback, feedbackList };
