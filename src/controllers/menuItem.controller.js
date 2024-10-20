import { HttpStatusCode } from "axios";
import { Response } from "../utils/response.js";
import { menuItemService } from "../services/menuItem.service.js";

const createMenuItem = async (req, res) => {
    try {
        const image = {
            url: req.file.path, 
            id: req.file.filename
        };
       
        const result = await menuItemService.createMenuItem(req.body, image);
        return new Response(HttpStatusCode.Created, 'Tạo thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
};

export const menuItemController = {
    createMenuItem,
};
