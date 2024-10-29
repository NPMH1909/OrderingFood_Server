import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { 
        url: {type: String, required: true},
        id: {type: String, required: true}
     },
    soldQuantity: {type: Number, default:0},
    //quantity: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
},
    { timestamps: true }
)

const menuItemModel = mongoose.model('MenuItems', menuItemSchema)
export default menuItemModel