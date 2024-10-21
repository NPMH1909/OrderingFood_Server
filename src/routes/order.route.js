import express from "express"
import { orderController } from "../controllers/order.controller.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/apiKey.middleware.js"

const orderRouter = express.Router()
orderRouter.post('/create', orderController.createOrder)
orderRouter.put('/update-status',requireApiKey, authenticationAdmin, orderController.updateOrderStatus)
orderRouter.get('/getall', requireApiKey, authenticationAdmin, orderController.getAllOrder)
orderRouter.get('/get',orderController.getOrderByUserId)

export default orderRouter