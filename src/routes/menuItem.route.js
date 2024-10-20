import express from "express"
import { menuItemController } from "../controllers/menuItem.controller.js"
import uploadFiles from "../middlewares/upload.middleware.js"

const menuItemRouter = express.Router()
menuItemRouter.post('/create',uploadFiles, menuItemController.createMenuItem)

export default menuItemRouter