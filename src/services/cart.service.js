import mongoose, { Types } from "mongoose";
import cartModel from "../models/cart.model.js";
import menuItemModel from "../models/menuItem.model.js";
import { NotFoundError } from "../errors/notFound.error.js";

const removeItemFromCart = async (userId, itemId) => {
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const updatedCart = await cartModel.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { item: itemId } } },
        { new: true }
    );

    return updatedCart;
};


const addItemToCart = async (userId, productId, quantity = 1) => {
    const product = await menuItemModel.findById(productId).orFail(new NotFoundError('Không tìm thấy sản phẩm'))

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const existingItemIndex = cart.items.findIndex((item) => item.item.equals(productId));
    if(!product.isAvailable){
      console.log('sản phẩm tạm đã hết')
    }else{
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ item: productId, quantity });
    }
    }

    return await cart.save();
};

const getCart = async (userId) => {
    const cart = await cartModel.aggregate([
      { 
        $match: { user: Types.ObjectId.createFromHexString(userId) } 
      },
      {
        $unwind: "$items"  // Tách từng sản phẩm trong giỏ hàng
      },
      {
        $lookup: {
          from: "menuitems", 
          localField: "items.item",
          foreignField: "_id",
          as: "itemDetails"
        }
      },
      {
        $unwind: {
          path: "$itemDetails",
          preserveNullAndEmptyArrays: true 
        }
      },
      {
        $addFields: {
          "items.price": "$itemDetails.price", 
          "items.imageUrl": "$itemDetails.image.url", 
          "items.name": "$itemDetails.name"
        }
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          totalAmount: { $first: "$totalAmount" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          items: { $push: "$items" },
          totalItems: { $sum: "$items.quantity" } // Tính tổng số lượng sản phẩm
        }
      }
    ]);
  
    return cart.length > 0 ? cart[0] : null; 
  };
  

export const cartService = {
    removeItemFromCart,
    addItemToCart,
    getCart,
};
