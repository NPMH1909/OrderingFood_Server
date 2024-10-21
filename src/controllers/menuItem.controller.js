import { HttpStatusCode } from "axios";
import { Response } from "../utils/response.js";
import { menuItemService } from "../services/menuItem.service.js";

const createItem = async (req, res) => {
    try {
        const image = {
            url: req.file.path, 
            id: req.file.filename
        };
       
        const result = await menuItemService.createItem(req.body, image);
        return new Response(HttpStatusCode.Created, 'Tạo thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};


const getMenu = async (req, res) => {
    try {
        const {searchTerm} = req.body
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const result = await menuItemService.getMenu(searchTerm, page, limit)
        return new Response(HttpStatusCode.Created, 'Tạo thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

const getItemByCategory = async(req, res) => {
    try {
        const {category, searchTerm} = req.body
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const result = await menuItemService.getItemByCategory(category, searchTerm, page, limit)
        return new Response(HttpStatusCode.Created, 'Tạo thành công', result).responseHandler(res);

    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;  
        
        if (req.file) {
            updates.image = {
                url: req.file.path,   
                id: req.file.filename 
            };
        }

        const updatedItem = await menuItemService.updateItem(id, updates);
        
        return new Response(HttpStatusCode.Ok, 'Cập nhật thành công', updatedItem).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};


export const menuItemController = {
    createItem,
    getMenu,
    getItemByCategory,
    updateItem
};
