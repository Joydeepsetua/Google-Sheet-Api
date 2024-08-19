import express from "express";
import { login, logout, refreshToken, register, user, users, editUser } from "../controllers/user.js";
import { loginValidator, registerValidator, updateUserValidator } from "../validators/user.js";
import { varifyAccessToken } from "../helper/jwt.js";

const router = express.Router();

router.get("/user", varifyAccessToken, users);
router.post("/user/register", registerValidator, register);
router.post("/user/login", loginValidator, login);
router.post("/user/refresh-token", refreshToken);
router.post("/user/:id", varifyAccessToken, updateUserValidator, editUser);
router.get("/user/:id", varifyAccessToken, user);
router.delete("/user/logout", logout);

export default router;