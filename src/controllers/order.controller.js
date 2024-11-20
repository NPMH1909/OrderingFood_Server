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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const email = req.query.email || '';  
        const status = req.query.status || '';  
        const result = await orderService.getAllOrder(email, status, page, limit);
        return new Response(HttpStatusCode.Ok, 'Lấy danh sách đơn hàng thành công', result).responseHandler(res);
    } catch (error) {
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
const getDailyRevenue = async (req, res) => {
    const { date } = req.query; 
  
    try {
      const revenue = await orderService.getRevenueForDay(date);
      res.status(200).json(revenue);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getYearlyRevenue = async (req, res) => {
    const { year } = req.query; 
  
    try {
      const revenue = await orderService.getRevenueForYear(year);
      res.status(200).json(revenue);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const getWeeklyRevenue = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const revenue = await orderService.getRevenueForWeek(startDate, endDate);
        res.status(200).json(revenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyRevenue = async (req, res) => {
    const { month, year } = req.query;

    try {
        const revenue = await orderService.getRevenueForMonth(month, year);
        res.status(200).json(revenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const orderController = {
    createOrder,
    updateOrderStatus,
    getOrderByUserId,
    getAllOrder,
    getOrderById,
    createPaymentOrderLink,
    getWeeklyRevenue,
    getMonthlyRevenue,
    getDailyRevenue,
    getYearlyRevenue,
}