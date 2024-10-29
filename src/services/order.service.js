import { payOS } from "../configs/payOs.config.js"
import { NotFoundError } from "../errors/notFound.error.js"
import orderModel from "../models/order.model.js"


const createPaymentOrderLink = async (userid, data) => {
    const { totalAmount, orderCode } = data
    const newOrder = new orderModel({...data, user:userid})
    const paymentLinkRes = await payOrder({ orderCode, total: totalAmount })
    return paymentLinkRes
}

const createOrder = async (userid, data) => {
    const {orderCode} = data
    const paymentInfo = await payOS.getPaymentLinkInformation(orderCode)
    const newOrder = new orderModel({...data, user:userid})    
    if (paymentInfo.status === "PAID") {
        return await newOrder.save()
    }
    return await newOrder.save()
}

const updateOrderStatus = async (id, status) => {
    const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true })
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

const getOrder = async (id) => {
    const order = await orderModel.findById(id).orFail(new NotFoundError('Không tìm thấy đơn hàng'))
    return order
}
const payOrder = async ({ orderCode, total }) => {
    const YOUR_DOMAIN = 'http://localhost:5173'
    const body = {
        orderCode,
        amount: Math.ceil(Number(total)),
        description: 'Thanh toán đơn hàng',
        returnUrl: `${YOUR_DOMAIN}/checkout-success`,
        cancelUrl: `${YOUR_DOMAIN}/checkout-cancel`
    }
    payOS.getPaymentLinkInformation
    return await payOS.createPaymentLink(body)
}
export const orderService = {
    createOrder,
    updateOrderStatus,
    getAllOrder,
    getOrderByUserId,
    getOrder,
    payOrder,
    createPaymentOrderLink
}