import express from "express"
import { orderController } from "../controllers/order.controller.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/apiKey.middleware.js"

const orderRouter = express.Router()
orderRouter.post('/create', orderController.createOrder)
orderRouter.put('/update-status:id',requireApiKey, authenticationAdmin, orderController.updateOrderStatus)
orderRouter.get('/getall', requireApiKey, authenticationAdmin, orderController.getAllOrder)
orderRouter.get('/user/getall/:id',orderController.getOrderByUserId)
orderRouter.get('/get/:id',orderController.getOrderById)

export default orderRouter