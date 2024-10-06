import { fetchUserOrderByBuyerId, insertOrder } from "../sheets/services/order.js";


const createOrder = async (req, res, next) => {
    try {
        const order = await insertOrder(req.body);
        res.status(200).json({
            status: 200,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        next(error)
    }
}

const userOrdersAsBuyer = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await fetchUserOrderByBuyerId(id);
        res.status(200).json({
            status: 200,
            message: "Fetch successfully",
            data: data,
        });
    } catch (error) {
        next(error)
    }
}


export { userOrdersAsBuyer, createOrder };
