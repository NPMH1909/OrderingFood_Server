import { NotFoundError } from "../errors/notFound.error.js"
import orderModel from "../models/order.model.js"

const createOrder = async(data) => {
    const newOrder = new orderModel({...data})
    return await newOrder.save()
}

const updateOrderStatus = async(id, status) => {
    const order = await orderModel.findByIdAndUpdate(id,{status}, {new: true})
    if (!order) {
        throw new NotFoundError("Có lỗi xảy ra");
    }
    return order
}

const getAllOrder = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const orders = await orderModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            if (orders.length === 0) {
                throw new NotFoundError('Không tìm thấy đơn hàng .');
            }
        const totalOrders = await orderModel.countDocuments(); 
        return {
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
        };
};

const getOrderByUserId = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const orders = await orderModel.find({ user: userId })
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);
        
        const totalOrders = await orderModel.countDocuments({ user: userId });
        
        if (orders.length === 0) {
            throw new NotFoundError('Không tìm thấy đơn hàng.');
        }
        return {
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
        };
};


export const orderService = {
    createOrder,
    updateOrderStatus,
    getAllOrder,
    getOrderByUserId,
}