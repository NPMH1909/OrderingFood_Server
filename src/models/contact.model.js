// models/contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v), // Đảm bảo là email hợp lệ
      message: 'Email không hợp lệ!',
    },
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
