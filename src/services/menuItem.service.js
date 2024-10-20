import menuItemModel from "../models/menuItem.model.js"

const createMenuItem = async(data, image) => {
    const newItem = new menuItemModel({...data, image})
    return await newItem.save()
}

const updateMenuItem = async(id, data) => {
    const item = menuItemModel.findByIdAndUpdate(id, {...data}, {new: true})
}

export const menuItemService = {
    createMenuItem,
    updateMenuItem
}