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

const getAllOrder = async (email, status, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // Xây dựng query động
    const query = {};

    // Nếu có email, thêm điều kiện tìm theo email
    if (email) {
        query['user.email'] = email;
    }

    // Nếu có status, thêm điều kiện tìm theo status
    if (status) {
        query['status'] = status;
    }

    // Tìm đơn hàng theo query, đồng thời populate thông tin từ các bảng khác
    const orders = await orderModel.find(query)
        .populate('user', 'name email')  // Lấy thông tin name và email từ người dùng
        .populate('items.menuItem', 'name')  // Lấy tên của món ăn từ MenuItems
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Tính tổng số đơn hàng
    const totalOrders = await orderModel.countDocuments(query);
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

    return {
        data: orders, info:{currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,}
        
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