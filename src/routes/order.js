import express from "express";
import { varifyAccessToken } from "../helper/jwt.js";
import { userOrdersAsBuyer, createOrder } from "../controllers/order.js";

const router = express.Router();

router.get("/orders/buyer/:id", varifyAccessToken, userOrdersAsBuyer);
router.post ("/orders", varifyAccessToken, createOrder)
export default router;