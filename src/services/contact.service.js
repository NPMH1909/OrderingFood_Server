// services/contactService.js
import Contact from '../models/contact.model.js';

// Hàm tạo liên hệ
export const createContact = async (contactData) => {
  try {
    const contact = new Contact(contactData);
    console.log('first', contact);
    await contact.save();
    return contact;
  } catch (error) {
    throw new Error('Lỗi khi lưu thông tin liên hệ!');
  }
};

// Hàm lấy tất cả liên hệ
export const getAllContacts = async (page = 1, limit = 10, dateFilter = null) => {
  try {
    // Tính toán số lượng bỏ qua (skip) cho phân trang
    const skip = (page - 1) * limit;

    // Lọc theo ngày nếu có
    let dateFilterCondition = {};
    if (dateFilter) {
      // Chuyển đổi chuỗi ngày vào dạng Date
      const startDate = new Date(dateFilter); // Ngày bắt đầu
      startDate.setHours(0, 0, 0, 0); // Đặt giờ thành 00:00:00 (bắt đầu ngày)
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999); // Đặt giờ thành 23:59:59 (kết thúc ngày)

      // Lọc tất cả các phản hồi trong ngày này
      dateFilterCondition = {
        createdAt: {
          $gte: startDate,  // Từ 00:00 ngày đó
          $lte: endDate,    // Đến 23:59:59 ngày đó
        },
      };
    }

    const totalContacts = await Contact.countDocuments(dateFilterCondition);

    // Tính số trang
    const totalPages = Math.ceil(totalContacts / limit);
        const contacts = await Contact.find(dateFilterCondition)
      .sort({ createdAt: -1 })  // Sắp xếp theo ngày giảm dần
      .skip(skip)                // Bỏ qua các bản ghi đã được tính toán
      .limit(limit);             // Giới hạn số lượng bản ghi trả về
    return {totalPages, contacts};
  } catch (error) {
    throw new Error('Lỗi khi lấy thông tin liên hệ!');
  }
};

