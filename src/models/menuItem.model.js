import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    //quantity: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
},
    { timestamps: true }
)

const menuItemModel = mongoose.model('MenuItems', menuItemSchema)
export default menuItemModel