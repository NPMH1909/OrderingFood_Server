import { BadRequestError } from "../errors/badRequest.error.js"
import { createApiKey, verifyToken } from "../middlewares/apiKey.middleware.js"
import { checkPassword, createHash } from "../middlewares/password.middleware.js"
import userModel from "../models/user.model.js"
import { sendVerificationCode } from "./mail.service.js"

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const register = async ({ email, password, retypePassword }) => {
    if (retypePassword !== password) {
        throw new BadRequestError('Mật khẩu không trùng khớp')
    }
    const verificationCode = generateVerificationCode()
    await sendVerificationCode(email, verificationCode)
    return createApiKey({ email, password, verificationCode })
}

const createUser = async (token, verification) => {
    const { email, password } = verifyToken(token, verification)
    const newUser = new userModel({
        email: email,
        password: await createHash(password)
    })
    return await newUser.save()
}

const login = async ({ username, password }) => {
    const user = await userModel.findOne({
        $or: [{ email: username }, { phone: username }]
    }).orFail(() => {
        throw new BadRequestError('Username or password is incorrect')
    })
    const isPasswordValid = await checkPassword(password, user.password)
    if (!isPasswordValid) {
        throw new BadRequestError('Username or password is incorrect')
    }
    return createApiKey({id: user._id, role: user.role})
}

const updateUser = async (id, data) => {
    const user = await userModel.findByIdAndUpdate(id,{...data}, {new: true})
    return user
}

const changePassword = async(id,{password, newPassword, retypeNewPassword}) => {
    const user = await userModel.findById(id).orFail(new BadRequestError('Không tìm thấy tài khoản'))
    const isPasswordValid = await checkPassword(password, user.password)
    if (!isPasswordValid) {
        throw new BadRequestError('Username or password is incorrect')
    }
    if(newPassword !== retypeNewPassword){
        throw new BadRequestError('Mật khẩu mới không trùng khớp')
    }
    const hashPassword = await createHash(newPassword)
    return await userModel.findByIdAndUpdate(id, {password: hashPassword}, {new: true})
}



export const userService = {
    register,
    createUser,
    login,
    changePassword
}
