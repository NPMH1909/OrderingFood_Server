import { payOS } from "../configs/payOs.config.js"
import { NotFoundError } from "../errors/notFound.error.js"
import menuItemModel from "../models/menuItem.model.js"
import orderModel from "../models/order.model.js"
import userModel from "../models/user.model.js"

const createPaymentOrderLink = async (userid, data) => {
    const { totalAmount, orderCode } = data
    const newOrder = new orderModel({...data, user:userid})
    const paymentLinkRes = await payOrder({ orderCode, total: totalAmount })
    return paymentLinkRes
}
// const createPaymentOrderLink = async (userid, data) => {
//   const { totalAmount, orderCode, items } = data;

//   // Kiểm tra tình trạng của các sản phẩm trong đơn hàng
//   for (const item of items) {
//       const menuItem = await menuItemModel.findById(item.menuItem);  // Lấy thông tin sản phẩm từ cơ sở dữ liệu

//       // Kiểm tra nếu sản phẩm không còn hàng hoặc không khả dụng
//       if (!menuItem || !menuItem.isAvailable) {
//           return { 
//               success: false,
//               message: `Sản phẩm ${menuItem.name} không còn hàng hoặc không khả dụng`
//           };
//       }
//   }

  // Tạo đơn hàng mới nếu tất cả sản phẩm còn hàng
//   const newOrder = new orderModel({ ...data, user: userid });

//   // Gọi API tạo liên kết thanh toán
//   const paymentLinkRes = await payOrder({ orderCode, total: totalAmount });

//   // Nếu thanh toán thành công, trả về liên kết thanh toán
//   return paymentLinkRes;
// }

// const createOrder = async (userid, data) => {
//     const {orderCode} = data
//     const paymentInfo = await payOS.getPaymentLinkInformation(orderCode)
//     const newOrder = new orderModel({...data, user:userid})    
//     if (paymentInfo.status === "PAID") {
//         return await newOrder.save()
//     }
//     return await newOrder.save()
// }

const createOrder = async (userid, data) => {
  const { orderCode, items } = data;
  const paymentInfo = await payOS.getPaymentLinkInformation(orderCode);
  const newOrder = new orderModel({ ...data, user: userid });
  if (paymentInfo.status === "PAID") {
      for (const item of items) {
          const menuItem = await menuItemModel.findById(item.menuItem);
          if (menuItem) {
              menuItem.soldQuantity += item.quantity;
              await menuItem.save(); 
          }
      }
      return await newOrder.save();
  }
  return await newOrder.save();
};
const updateOrderStatus = async (id, status) => {
    const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) {
        throw new NotFoundError("Có lỗi xảy ra");
    }
    return order
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

  if (status) {
      query['status'] = status;
  }

  if (date) {
    const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString();

    query['createdAt'] = { $gte: new Date(startOfDay), $lte: new Date(endOfDay) };
  }

  const orders = await orderModel.find(query)
      .populate('user', 'name email')  
      .populate('items.menuItem', 'name price') 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
        cancelUrl: `${YOUR_DOMAIN}/cart`
    }
    payOS.getPaymentLinkInformation
    return await payOS.createPaymentLink(body)
}

const getRevenueForDay = async (date) => {
  try {
    const targetDate = new Date(date);  
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0); 
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999); 
    const orders = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay, 
            $lt: endOfDay 
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 } 
      }
    ]);

    return orders;
  } catch (error) {
    throw new Error('Error fetching daily revenue');
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
    getRevenueForYear
}