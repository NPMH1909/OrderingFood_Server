import express from "express"
import { requireApiKey } from "../middlewares/apiKey.middleware.js"
import { cartController } from "../controllers/cart.controller.js"

const cartRouter = express.Router()
cartRouter.get('/', requireApiKey, cartController.getCart)
cartRouter.post('/add',requireApiKey, cartController.addItemToCart)

cartRouter.delete('/remove', requireApiKey, cartController.removeItemFromCart)


export default cartRouter