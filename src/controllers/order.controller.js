import { HttpStatusCode } from "axios"
import { Response } from "../utils/response.js"
import { orderService } from "../services/order.service.js"



const createPaymentOrderLink = async (req, res) => {
    try {
        const result = await orderService.createPaymentOrderLink(req.user.id, req.body)
        return new Response(HttpStatusCode.Created, 'Tạo thành công đơn hàng', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.user.id, req.body)
        return new Response(HttpStatusCode.Created, 'Tạo thành công đơn hàng', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const result = await orderService.updateOrderStatus(id, status)
        return new Response(HttpStatusCode.Ok, 'Cập nhật trạng thái thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const getAllOrder = async (req, res) => {
    try {
        // Lấy giá trị page và limit từ query string, mặc định là 1 và 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Lấy các tham số email và status từ query string (nếu có)
        const email = req.query.email || '';  // Default là rỗng nếu không có
        const status = req.query.status || '';  // Default là rỗng nếu không có

        // Gọi service để lấy danh sách đơn hàng với các tham số lọc
        const result = await orderService.getAllOrder(email, status, page, limit);

        // Trả về kết quả
        return new Response(HttpStatusCode.Ok, 'Lấy danh sách đơn hàng thành công', result).responseHandler(res);
    } catch (error) {
        // Xử lý lỗi và trả về response
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

const getOrderByUserId = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const result = await orderService.getOrderByUserId(req.user.id, page, limit)
        return new Response(HttpStatusCode.Ok, 'Lấy danh sách đơn hàng thành công', result.data, result.info).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await orderService.getOrder(id)
        return new Response(HttpStatusCode.Ok, 'Lấy danh sách đơn hàng thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}


export const orderController = {
    createOrder,
    updateOrderStatus,
    getOrderByUserId,
    getAllOrder,
    getOrderById,
    createPaymentOrderLink
}