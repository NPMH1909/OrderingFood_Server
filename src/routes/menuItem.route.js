import express from "express"
import { menuItemController } from "../controllers/menuItem.controller.js"
import uploadFiles from "../middlewares/upload.middleware.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/apiKey.middleware.js"

const menuItemRouter = express.Router()
menuItemRouter.post('/create', requireApiKey,authenticationAdmin, uploadFiles, menuItemController.createItem)
menuItemRouter.put('/update/:id', requireApiKey,authenticationAdmin, uploadFiles, menuItemController.updateItem)
menuItemRouter.get('/getall', menuItemController.getMenu)
menuItemRouter.get('/getallbycategory', menuItemController.getItemByCategory)

export default menuItemRouter