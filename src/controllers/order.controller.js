import { HttpStatusCode } from "axios"
import { Response } from "../utils/response.js"
import { orderService } from "../services/order.service.js"

const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.body)
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
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const result = await orderService.getAllOrder(page, limit)
        return new Response(HttpStatusCode.Ok, 'Lấy danh sách đơn hàng thành công', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const getOrderByUserId = async (req, res) => {
    try {
        const userid = req.user.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const result = await orderService.getOrderByUserId(userid, page, limit)
        return new Response(HttpStatusCode.Ok, 'Lấy danh sách đơn hàng thành công', result).responseHandler(res)
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
    getOrderById
}