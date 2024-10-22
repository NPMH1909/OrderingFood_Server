import { HttpStatusCode } from "axios";
import { paymentService } from "../services/payment.service.js";
import { Response } from "../utils/response.js";

const createOrder = async (req, res) => {
    try {
        const order = await paymentService.createOrder(req.body);
        return new Response(HttpStatusCode.Ok, 'Success', order).responseHandler(res)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create order" });
    }
};

const captureOrder = async (req, res) => {
    const { orderID } = req.body;
    try {
        const capture = await paymentService.captureOrder(orderID);
        return new Response(HttpStatusCode.Ok, 'Success', capture).responseHandler(res)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to capture order" });
    }
}

export const paymentController = {
    createOrder,
    captureOrder,
}
