// controllers/contactController.js
import { createContact, getAllContacts } from "../services/contact.service.js";

// Controller tạo liên hệ
export const createContactController = async (req, res) => {
  const { name, email, message } = req.body;

  // Kiểm tra nếu thiếu thông tin
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
  }

  try {
    const contact = await createContact({ name, email, message });
    res.status(201).json({
      message: 'Thông tin liên hệ đã được gửi thành công!',
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller lấy tất cả liên hệ
export const getAllContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      message: 'Danh sách liên hệ',
      contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
