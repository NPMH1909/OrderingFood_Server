import { HttpStatusCode } from "axios";
import { Response } from "../utils/response.js";
import { menuItemService } from "../services/menuItem.service.js";

const createItem = async (req, res) => {
    try {
        const image = {
            url: req.file.location, 
            id: req.file.key 
        };
       
        const result = await menuItemService.createItem(req.body, image);
        return new Response(HttpStatusCode.Created, 'Tạo thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};


const getMenu = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 8
        const result = await menuItemService.getMenu(searchTerm, page, limit)
        return new Response(HttpStatusCode.Created, 'Lấy menu thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

const getMenuForAdmin = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 8
        const result = await menuItemService.getMenuForAdmin(searchTerm, page, limit)
        return new Response(HttpStatusCode.Created, 'Lấy menu thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};


const getCategory = async(req, res) => {
    try {
        const result = await menuItemService.getCategory()
        return new Response(HttpStatusCode.Created, 'Lấy menu thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}
const getItemByCategory = async(req, res) => {
    try {
        const {category, searchTerm} = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 8
        const result = await menuItemService.getItemByCategory(category, searchTerm, page, limit)
        return new Response(HttpStatusCode.Created, 'Lấy danh sách sản phẩm thành công', result).responseHandler(res);

    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}
const getItemByCategoryForAdmin = async(req, res) => {
    try {
        const {category, searchTerm} = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 8
        const result = await menuItemService.getItemByCategoryForAdmin(category, searchTerm, page, limit)
        return new Response(HttpStatusCode.Created, 'Lấy danh sách sản phẩm thành công', result).responseHandler(res);

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

const getItem = async(req, res) => {
    try{
        const {id} = req.params
        const updatedItem = await menuItemService.getItem(id);
        return new Response(HttpStatusCode.Ok, 'Lấy item thành công', updatedItem).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}
const deleleItem = async(req, res) => {
    try{
        const {id} = req.params
        const updatedItem = await menuItemService.deleleItem(id);
        return new Response(HttpStatusCode.Ok, 'xóa thành công', updatedItem).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const getTopBestSellingProduct = async(req, res) => {
    try {
        const result = await menuItemService.getTopBestSellingProduct();
        return new Response(HttpStatusCode.Ok, 'lấy items thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const getNewProduct = async(req, res) => {
    try {
        const result = await menuItemService.getNewProduct();
        return new Response(HttpStatusCode.Ok, 'Lấy items thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}
export const menuItemController = {
    createItem,
    getMenu,
    getItemByCategory,
    updateItem,
    getItem,
    deleleItem,
    getCategory,
    getTopBestSellingProduct,
    getNewProduct,
    getMenuForAdmin,
    getItemByCategoryForAdmin
};
