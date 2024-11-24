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
export const getAllContacts = async () => {
  try {
    // Lấy tất cả liên hệ từ cơ sở dữ liệu
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error('Lỗi khi lấy thông tin liên hệ!');
  }
};
