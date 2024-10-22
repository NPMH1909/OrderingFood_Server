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

const getMenu = async (searchTerm = '', page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const searchCondition = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } } 
        : {};
    const menuItems = await menuItemModel.find(searchCondition)
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

const getItemByCategory = async (category, searchTerm = '', page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const searchCondition = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } } 
        : {};
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
    const {name, } = data
    if(name === existedItem.name){

    }
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
export const menuItemService = {
    createItem,
    updateItem,
    getMenu,
    getItemByCategory,
    getItem,
    deleleItem
}