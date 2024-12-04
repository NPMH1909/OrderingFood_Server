import { ConflictError } from "../errors/conflict.error.js"
import { NotFoundError } from "../errors/notFound.error.js"
import menuItemModel from "../models/menuItem.model.js"

const createItem = async (data, image) => {
    const { name } = data
    const existedItem = await menuItemModel.findOne({ name })
    if (existedItem) {
        throw new ConflictError('Sản phẩm đã tồn tại')
    }
    const newItem = new menuItemModel({ ...data, image })
    return await newItem.save()
}

const getMenuForAdmin = async (searchTerm = '', page = 1, limit = 8) => {
    const skip = (page - 1) * limit;
    const searchCondition = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } } 
        : {};
    const menuItems = await menuItemModel.find(searchCondition)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
    const totalItems = await menuItemModel.countDocuments(searchCondition);
    const totalPages = Math.ceil(totalItems / limit);
    return {
        menuItems,
        currentPage: page,
        totalPages,
        totalItems,
    };
};

const getMenu = async (searchTerm = '', page = 1, limit = 8) => {
    const skip = (page - 1) * limit;
    const searchCondition = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } } 
        : {};
    const menuItems = await menuItemModel.find(searchCondition)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
    const totalItems = await menuItemModel.countDocuments(searchCondition);
    const totalPages = Math.ceil(totalItems / limit);
    return {
        menuItems,
        currentPage: page,
        totalPages,
        totalItems,
    };
};



const getItemByCategoryForAdmin = async (category, searchTerm = '', page = 1, limit = 8) => {
    const skip = (page - 1) * limit;
    const searchCondition = searchTerm 
    ? { name: { $regex: searchTerm, $options: 'i' } }
    : {}; // Nếu không có searchTerm thì không cần thêm điều kiện
    const query = {
        category,
        ...searchCondition, 
    };
    const menuItems = await menuItemModel.find(query)
        .skip(skip)
        .limit(limit);
    const totalItems = await menuItemModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return {
        menuItems,
        currentPage: page,
        totalPages,
        totalItems,
    };
};
const getItemByCategory = async (category, searchTerm = '', page = 1, limit = 8) => {
    const skip = (page - 1) * limit;
    const searchCondition = {
        isAvailable: true, 
        ...(searchTerm && { name: { $regex: searchTerm, $options: 'i' } }), // Nếu có searchTerm thì thêm điều kiện
    };
    const query = {
        category,
        ...searchCondition, 
    };
    const menuItems = await menuItemModel.find(query)
        .skip(skip)
        .limit(limit);
    const totalItems = await menuItemModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return {
        menuItems,
        currentPage: page,
        totalPages,
        totalItems,
    };
};

const updateItem = async (id, data) => {
    const existedItem = await menuItemModel.findById(id)
    // const {name, } = data
    // if(name === existedItem.name){

    // }
    const item = menuItemModel.findByIdAndUpdate(id, { ...data }, { new: true })
    return await item
}

const getItem = async(id) => {
    const item = await menuItemModel.findById(id).orFail(new NotFoundError('Không tìm thấy sản phẩm'))
    return item
}

const deleleItem = async(id) => {
    return await menuItemModel.findByIdAndDelete(id).orFail(new NotFoundError('Không thể xóa sản phẩm'))
}

const getCategory = async() => {
    return await menuItemModel.distinct('category')
}


const getTopBestSellingProduct = async()=>{
    return await menuItemModel.find().sort({soldQuantity: -1}).limit(8)
}

const getNewProduct = async() => {
    return await menuItemModel.find().sort({createdAt:-1}).limit(8)
}
export const menuItemService = {
    createItem,
    updateItem,
    getMenu,
    getMenuForAdmin,
    getItemByCategory,
    getItemByCategoryForAdmin,
    getItem,
    deleleItem,
    getCategory,
    getTopBestSellingProduct,
    getNewProduct
}