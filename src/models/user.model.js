import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, default:'' },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, required: true, default: 'USER', enum: ['USER', 'ADMIN'] },
},
    { timestamps: true }
)

const userModel = mongoose.model('Users', userSchema)
export default userModel