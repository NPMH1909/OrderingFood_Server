import express from "express"
import { orderController } from "../controllers/order.controller.js"
import { authenticationAdmin, requireApiKey } from "../middlewares/apiKey.middleware.js"

const orderRouter = express.Router()
orderRouter.post('/create',requireApiKey, orderController.createOrder)
orderRouter.post('/create-link',requireApiKey, orderController.createPaymentOrderLink)
orderRouter.put('/orders/:id',requireApiKey, authenticationAdmin, orderController.updateOrderStatus)
orderRouter.get('/getall', requireApiKey, authenticationAdmin, orderController.getAllOrder)
orderRouter.get('/user/getall',requireApiKey, orderController.getOrderByUserId)
orderRouter.get('/get/:id',orderController.getOrderById)
orderRouter.get('/revenue/week', orderController.getWeeklyRevenue);
orderRouter.get('/revenue/month', orderController.getMonthlyRevenue);
orderRouter.get('/revenue/date', orderController.getDailyRevenue);
orderRouter.get('/revenue/year', orderController.getYearlyRevenue);


export default orderRouter