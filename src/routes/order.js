import express from "express";
import { varifyAccessToken } from "../helper/jwt.js";
import { userOrdersAsBuyer } from "../controllers/order.js";

const router = express.Router();

router.get("/orders/buyer/:id", varifyAccessToken, userOrdersAsBuyer);

export default router;