const addFeedbackValidator = async (req, res, next) => {
    const { feedbackType, description } = req.body;
    if (!feedbackType || !description) {
        return res.status(400).send({
            status: 400,
            message: `One or more field missing`
        });
    }
    next();
}

export { addFeedbackValidator };
