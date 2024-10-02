import { fetchUserOrderByBuyerId } from "../sheets/services/order.js";


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


export { userOrdersAsBuyer };
