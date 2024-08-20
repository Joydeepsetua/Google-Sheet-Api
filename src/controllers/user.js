import createHttpError from 'http-errors';
import { signAccessToken, signRefreshToken } from '../helper/jwt.js';
import { fetchUser, fetchUsersList, insertData, fetchUserByIb, updateUser } from '../sheets/services/user.js';

const register = async (req, res, next) => {
    try {
        const user = await insertData(req.body);
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        res.status(200).json({
            status: 200,
            message: "Your account has been created.",
            user,
            authorization: {
                type: 'bearer', accessToken, refreshToken
            }
        });
    } catch (error) {
        next(error)
    }
}
const login = async (req, res, next) => {
    try {
        // const user = await fetchUser(req.body);

        // if (!user)
        //     throw createHttpError[404]("Invalid credentials");

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.status(200).json({
            status: 200,
            message: "You are successfully logged in.",
            user,
            authorization: {
                type: 'bearer', accessToken, refreshToken
            }
        });
    } catch (error) {
        next(error)
    }

}
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createHttpError[400]();
        const userId = await varifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        res.status(200).json({
            status: 200,
            message: "Your token has been refreshed.",
            authorization: {
                accessToken: accessToken, refreshToken: refToken, type: 'bearer'
            }
        });
    } catch (error) {
        next(error)
    }
}
const logout = async (req, res, next) => {
    res.status(200).json({ message: "logout" });
}
const users = async (req, res, next) => {
    try {
        const userList = await fetchUsersList();
        res.status(200).json({
            status: 200,
            message: "ALl users fetch successfully",
            data: userList,
        });
    } catch (error) {
        next(error)
    }
}
const editUser = async (req, res, next) => {
    try {
        const user = await updateUser(req);
        res.status(200).json({
            status: 200,
            message: "User update successfully",
            data: user,
        });
    } catch (error) {
        next(error)
    }
}
const user = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await fetchUserByIb(id);
        res.status(200).json({
            status: 200,
            message: "User fetch successfully",
            data: user,
        });
    } catch (error) {
        next(error)
    }
}


export { register, login, refreshToken, logout, users, user, editUser };