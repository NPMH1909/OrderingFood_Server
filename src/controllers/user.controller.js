import { HttpStatusCode } from "axios"
import { userService } from "../services/user.service.js"
import { Response } from "../utils/response.js"

const register = async (req, res) => {
    try {
        const { email, password, retypePassword } = req.body
        const result = await userService.register({ email, password, retypePassword })
        return new Response(HttpStatusCode.Ok, 'Success', result).responseHandler(res)
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res)
    }
}

const createUser = async (req, res) => {
    try {
        const { verificationCode } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const result = await userService.createUser(token, verificationCode);
        return new Response(HttpStatusCode.Ok, 'User created successfully', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const login = async (req, res) => {
    try {
        const result = await userService.login(req.body)
        return new Response(HttpStatusCode.Ok, 'login successfully', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { password, newPassword, retypeNewPassword } = req.body
        const result = await userService.changePassword(id, { password, newPassword, retypeNewPassword })
        return new Response(HttpStatusCode.Ok, 'login successfully', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const result = await userService.forgotPassword(email)
        return new Response(HttpStatusCode.Ok, 'Gửi mật khẩu mới thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}

const updateUser = async(req, res) => {
    try {
        const {id} = req.params
        const {phoneNumber, address, name} = req.body
        const result = await userService.updateUser(id, {phoneNumber, address, name})
        return new Response(HttpStatusCode.Ok, 'Gửi mật khẩu mới thành công', result).responseHandler(res);
    } catch (error) {
        return new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).responseHandler(res);
    }
}
export const userController = {
    register,
    createUser,
    login,
    changePassword,
    forgotPassword,
    updateUser
}

