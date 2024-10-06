import express from "express";
import { varifyAccessToken } from "../helper/jwt.js";
import { userProducts, addProduct } from "../controllers/product.js";

const router = express.Router();

router.get("/product", varifyAccessToken, userProducts);
router.post("/product", varifyAccessToken, addProduct);

export default router;