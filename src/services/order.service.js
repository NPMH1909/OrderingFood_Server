import { payOS } from "../configs/payOs.config.js"
import { NotFoundError } from "../errors/notFound.error.js"
import menuItemModel from "../models/menuItem.model.js"
import orderModel from "../models/order.model.js"
import userModel from "../models/user.model.js"

const createPaymentOrderLink = async (userid, data) => {
  const { totalAmount, orderCode } = data
  const newOrder = new orderModel({ ...data, user: userid })
  const paymentLinkRes = await payOrder({ orderCode, total: totalAmount })
  return paymentLinkRes
}

// const createOrder = async (userid, data) => {
//   const { orderCode, items } = data;
//   const paymentInfo = await payOS.getPaymentLinkInformation(orderCode);
//   const newOrder = new orderModel({ ...data, user: userid });
//   if (paymentInfo.status === "PAID") {
//       for (const item of items) {
//           const menuItem = await menuItemModel.findById(item.menuItem);
//           if (menuItem) {
//               menuItem.soldQuantity += item.quantity;
//               await menuItem.save(); 
//           }
//       }
//       return await newOrder.save();
//   }
//   return await newOrder.save();
// };

const createOrder = async (userid, data) => {
  const { totalAmount, paymentMethod } = data;
  const orderCode = Number(String(new Date().getTime()).slice(-6))
  const newOrder = new orderModel({
    ...data,
    user: userid,
    orderCode
  });

  if (paymentMethod === "Cash") {
    const savedOrder = await newOrder.save();
    return {
      order: savedOrder,
    };
  }

  if (paymentMethod === "Online") {
    // Lưu đơn hàng trước
    const savedOrder = await newOrder.save();
    const paymentLinkRes = await payOrder({
      orderCode,
      total: totalAmount,
    });
    console.log("link", paymentLinkRes)
    return {orderCode, order: savedOrder, paymentLinkRes };
  }

  throw new Error("Invalid payment method");
};


const handlePaymentCallback = async (orderCode) => {
  console.log("orderCode", orderCode)
  const paymentInfo = await payOS.getPaymentLinkInformation(orderCode);
  console.log('payment', paymentInfo)
  if (paymentInfo.status === "CANCELLED") {
    // Cập nhật trạng thái đơn hàng thành Cancelled nếu thanh toán bị hủy
    const order = await orderModel.findOne({ orderCode });
    if (order) {
      order.status = "Cancelled";
      order.isPayment = "FAILED";
      await order.save();
      console.log('Order has been cancelled due to payment failure');
    }
  } else if (paymentInfo.status === "PAID") {
    // Cập nhật trạng thái thanh toán thành PAID
    const order = await orderModel.findOne({ orderCode });
    if (order) {
      order.isPayment = "PAID";
      await order.save();
      console.log('Order has been paid');
    }
  }
};

const updateOrderStatus = async (id, status) => {
  let order = await orderModel.findById(id);  // Tìm đơn hàng theo ID

  if (!order) {
    throw new NotFoundError("Đơn hàng không tồn tại");
  }

  if (status === 'Cancelled' && order.status === 'Pending') {
    console.log('Updating status to Cancelled');
    order.status = 'Cancelled';  // Cập nhật trạng thái thành 'Cancelled'
    await order.save();  // Lưu thay đổi
  } else if (status === 'Success') {
    // Cập nhật trạng thái thành 'Success' và cập nhật 'isPayment' thành 'PAID'
    order.status = status;
    order.isPayment = 'PAID';

    // Cập nhật số lượng đã bán cho từng menu item
    for (const item of order.items) {
      const menuItem = await menuItemModel.findById(item.menuItem);
      if (menuItem) {
        menuItem.soldQuantity += item.quantity;
        await menuItem.save();
      }
    }
    await order.save();  // Lưu thay đổi sau khi cập nhật số lượng
  } else if (status !== 'Cancelled') {
    // Chỉ cập nhật trạng thái nếu không phải là 'Cancelled' khi trạng thái là 'Pending'
    order.status = status;
    await order.save();  // Lưu thay đổi
  } else {
    console.log('Không thể cập nhật trạng thái vì điều kiện không hợp lệ');
    throw new Error("Không thể cập nhật trạng thái này");
  }

  return order;  // Trả về đơn hàng đã được cập nhật
}




// const getAllOrder = async (email, status, page = 1, limit = 10) => {
//     const skip = (page - 1) * limit;
//     const query = {};
//     if (email) {
//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return {
//                 orders: [],
//                 currentPage: page,
//                 totalPages: 0,
//                 totalOrders: 0,
//             };
//         }
//         query['user'] = user._id;
//     }
//     if (status) {
//         query['status'] = status;
//     }
//     const orders = await orderModel.find(query)
//         .populate('user', 'name email')  
//         .populate('items.menuItem', 'name price') 
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);

//     const totalOrders = await orderModel.countDocuments(query);
//     return {
//         orders,
//         currentPage: page,
//         totalPages: Math.ceil(totalOrders / limit),
//         totalOrders,
//     };
// };

const getAllOrder = async (email, status, page = 1, limit = 10, date) => {
  const skip = (page - 1) * limit;
  const query = {};

  // Lọc theo email người dùng
  if (email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      return {
        orders: [],
        currentPage: page,
        totalPages: 0,
        totalOrders: 0,
      };
    }
    query['user'] = user._id;
  }

  // Lọc theo trạng thái
  if (status) {
    query['status'] = status;
  } else {
    // Mặc định loại bỏ các đơn hàng Online chưa thanh toán và chưa bị hủy
    query['$or'] = [
      { paymentMethod: { $ne: 'Online' } }, // Lấy tất cả các đơn không phải Online
      { $and: [{ paymentMethod: 'Online' }, { isPayment: 'PAID' }] }, // Online đã thanh toán
      { $and: [{ paymentMethod: 'Online' }, { status: 'Cancelled' }] }, // Online đã hủy
    ];
  }

  // Lọc theo ngày
  if (date) {
    const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString();
    query['createdAt'] = { $gte: new Date(startOfDay), $lte: new Date(endOfDay) };
  }

  // Lấy danh sách đơn hàng
  const orders = await orderModel.find(query)
    .populate('user', 'name email')
    .populate('items.menuItem', 'name price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Tổng số lượng đơn hàng
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
    .limit(limit)
    .populate({
      path: 'items.menuItem',
      select: 'name price',
    });

  const totalOrders = await orderModel.countDocuments({ user: userId });

  return {
    data: orders,
    info: {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    },
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
    returnUrl: `${YOUR_DOMAIN}/order/history`,
    cancelUrl: `${YOUR_DOMAIN}/order/history`
  }
  payOS.getPaymentLinkInformation
  return await payOS.createPaymentLink(body)
}


const getRevenueForDay = async (date) => {
  try {
    // Chuyển đổi sang Date và đặt thời gian bắt đầu/kết thúc ngày
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Truy vấn dữ liệu
    const salesData = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lt: endOfDay }, // Lọc theo khoảng thời gian
          status: "Success", // Chỉ lấy đơn hàng có trạng thái Success
        },
      },
      {
        $unwind: "$items", // Tách mảng items thành từng tài liệu riêng
      },
      {
        $group: {
          _id: "$items.menuItem", // Nhóm theo menuItem
          totalSold: { $sum: "$items.quantity" }, // Tổng số lượng từng món
        },
      },
      {
        $lookup: {
          from: "menuitems", // Bảng (collection) tham chiếu
          localField: "_id",
          foreignField: "_id",
          as: "menuItemDetails", // Thông tin chi tiết món ăn
        },
      },
      {
        $project: {
          _id: 0,
          menuItem: { $arrayElemAt: ["$menuItemDetails", 0] }, // Lấy phần tử đầu tiên trong menuItemDetails
          totalSold: 1,
        },
      },
      {
        $sort: { totalSold: -1 }, // Sắp xếp theo tổng số lượng bán được, giảm dần
      },
    ]);

    // Tính tổng doanh thu từ tất cả các đơn hàng thành công
    const totalRevenueResult = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lt: endOfDay }, // Lọc theo khoảng thời gian
          status: "Success", // Chỉ lấy đơn hàng có trạng thái Success
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo bất kỳ trường nào
          totalRevenue: { $sum: "$totalAmount" }, // Tính tổng doanh thu
        },
      },
    ]);

    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // Trả về đối tượng theo yêu cầu
    return {
      data: salesData, // Mảng các món ăn và tổng số lượng bán được
      totalRevenue, // Tổng doanh thu
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching daily sales and revenue");
  }
};

const getRevenueForWeek = async (startDate, endDate) => {
  try {
    const orders = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: {
            $cond: [{ $eq: ["$_id", 1] }, 7, { $subtract: ["$_id", 1] }]
          },
          totalRevenue: 1
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    return orders;
  } catch (error) {
    throw new Error('Error fetching weekly revenue');
  }
};


const getRevenueForMonth = async (month, year) => {
  try {
    // Tính ngày bắt đầu của tháng (Ngày 1 của tháng)
    const monthStart = new Date(year, month - 1, 1); // Tháng trong JavaScript bắt đầu từ 0, nên trừ 1

    // Tính ngày kết thúc của tháng (Ngày cuối cùng của tháng)
    const monthEnd = new Date(year, month, 0); // Ngày cuối cùng của tháng

    // Truy vấn doanh thu trong phạm vi tháng
    const orders = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return orders;
  } catch (error) {
    throw new Error('Error fetching monthly revenue');
  }
};

const getRevenueForYear = async (year) => {
  try {
    const orders = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`), // Lọc theo đầu năm
            $lt: new Date(`${parseInt(year) + 1}-01-01`) // Lọc theo đầu năm sau
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Nhóm theo tháng
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 } // Sắp xếp theo tháng
      }
    ]);
    return orders;
  } catch (error) {
    throw new Error('Error fetching yearly revenue');
  }
};

export const orderService = {
  createOrder,
  updateOrderStatus,
  getAllOrder,
  getOrderByUserId,
  getOrder,
  payOrder,
  createPaymentOrderLink,
  getRevenueForDay,
  getRevenueForWeek,
  getRevenueForMonth,
  getRevenueForYear,
  handlePaymentCallback
}