import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    orderCode: {type: String},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItems',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivery', 'Success', 'Cancelled'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Online'],
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    isPayment: {
        type: String,
        enum: ['PAID', 'UNPAID', 'FAILED'],
        default: 'UNPAID' 
    },
    orderCode:{
        type: String,
    }
}, { timestamps: true });

const orderModel = mongoose.model('Orders', orderSchema)
export default orderModel