import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'USER', enum: ['USER', 'ADMIN'] },
    phoneNumber: { type: String, unique: true },
    address: { type: String },
    name: { type: String },

},
    { timestamps: true }
)

const userModel = mongoose.model('Users', userSchema)
export default userModel