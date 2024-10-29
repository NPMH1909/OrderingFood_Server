import express from "express"
import { userController } from "../controllers/user.controller.js"
import { requireApiKey } from "../middlewares/apiKey.middleware.js"

const userRouter = express.Router()
userRouter.post('/register', userController.register)
userRouter.post('/create', userController.createUser)
userRouter.post('/login', userController.login)
userRouter.post('/change-password/:id', userController.changePassword)
userRouter.post('/forgot-password', userController.forgotPassword)
userRouter.post('/update/:id', userController.updateUser)
userRouter.get('/', requireApiKey, userController.getUserById)

export default userRouter