import { validatePassword } from "../helper/commonFunctions.js";

const registerValidator = async (req, res, next) => {
    const { name, email, age, password, } = req.body;
    if (!email || !password || !name || !age) {
        return res.status(400).send({
            status: 400,
            message: `One or more field missing`
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!(emailRegex.test(email))) {
        return res.status(400).send({
            status: 400,
            message: `Invalid email address`
        });
    }
    const message = validatePassword(password);
    if (message) {
        return res.status(400).send({
            status: 400,
            message
        });
    }
    next();
}

const loginValidator = async (req, res, next) => {
    const { email, password, } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            status: 400,
            message: `One or more field missing`
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!(emailRegex.test(email))) {
        return res.status(400).send({
            status: 400,
            message: `Invalid email address`
        });
    }
    const message = validatePassword(password);
    if (message) {
        return res.status(400).send({
            status: 400,
            message: `Invalid password`
        });
    }
    next();
}

const updateUserValidator = async (req, res, next) => {
    const { name, age, } = req.body;
    const { id } = req.params;
    if (!name || !age || !id) {
        return res.status(400).send({
            status: 400,
            message: `One or more field missing`
        });
    }
    next();
}
export { registerValidator, loginValidator, updateUserValidator };