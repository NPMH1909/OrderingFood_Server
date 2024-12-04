import express from "express"
import { menuItemController } from "../controllers/menuItem.controller.js"
import uploadFiles from "../middlewares/upload.middleware.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/apiKey.middleware.js"

const menuItemRouter = express.Router()
menuItemRouter.post('/create', requireApiKey,authenticationAdmin, uploadFiles, menuItemController.createItem)
menuItemRouter.put('/update/:id', requireApiKey,authenticationAdmin, uploadFiles, menuItemController.updateItem)
menuItemRouter.get('/getall', menuItemController.getMenu)
menuItemRouter.get('/admin/getall', menuItemController.getMenuForAdmin)
menuItemRouter.get('/getallbycategory', menuItemController.getItemByCategory)
menuItemRouter.get('/admin/getallbycategory', menuItemController.getItemByCategoryForAdmin)
menuItemRouter.get('/get-item/:id', menuItemController.getItem)
menuItemRouter.get('/get-category', menuItemController.getCategory)
menuItemRouter.delete('/delete-item/:id', menuItemController.deleleItem)
menuItemRouter.get('/best-seller', menuItemController.getTopBestSellingProduct)
menuItemRouter.get('/new-product', menuItemController.getNewProduct)

export default menuItemRouter