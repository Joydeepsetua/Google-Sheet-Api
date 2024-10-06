import { insertProduct, fetchUserProductByUserId } from "../sheets/services/product.js";

const addProduct = async (req, res, next) => {
    try {
        const product = await insertProduct(req.body);
        res.status(200).json({
            status: 200,
            message: "Add successfully",
            data: product,
        });
    } catch (error) {
        next(error)
    }
}

const userProducts = async (req, res, next) => {
    try {
        const id = req.query.userId;
        const user = await fetchUserProductByUserId(id);
        res.status(200).json({
            status: 200,
            message: "Fetch successfully",
            data: user,
        });
    } catch (error) {
        next(error)
    }
}


export { addProduct, userProducts };