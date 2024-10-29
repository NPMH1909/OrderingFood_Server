import { HttpStatusCode } from "axios";
import { cartService } from "../services/cart.service.js";
import { Response } from "../utils/response.js";

const removeItemFromCart = async (req, res) => {
    try {
        const result = await cartService.removeItemFromCart(req.user.id, req.body.itemId);
        return new Response(HttpStatusCode.Created, 'Thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

const addItemToCart = async (req, res) => {
    try {
        const result = await cartService.addItemToCart(req.user.id, req.body.productId, req.body.quantity);
        return new Response(HttpStatusCode.Created, 'Thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

const getCart = async (req, res) => {
    try {
        const result = await cartService.getCart(req.user.id);
        return new Response(HttpStatusCode.Ok, 'Thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

export const cartController = {
    addItemToCart,
    getCart,
    removeItemFromCart
};
