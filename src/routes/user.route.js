import express from "express"
import { userController } from "../controllers/user.controller.js"

const userRouter = express.Router()
userRouter.post('/register', userController.register)
userRouter.post('/create', userController.createUser)
userRouter.post('/login', userController.login)
userRouter.post('/change-password/:id', userController.changePassword)
userRouter.post('/forgot-password', userController.forgotPassword)
userRouter.post('/update/:id', userController.updateUser)

export default userRouter