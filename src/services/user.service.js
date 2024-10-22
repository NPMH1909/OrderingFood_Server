import { BadRequestError } from "../errors/badRequest.error.js"
import { ConflictError } from "../errors/conflict.error.js"
import { createApiKey, verifyToken } from "../middlewares/apiKey.middleware.js"
import { checkPassword, createHash } from "../middlewares/password.middleware.js"
import userModel from "../models/user.model.js"
import { sendNewPassword, sendVerificationCode } from "./mail.service.js"

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
const generateRandomString = () => {
    return Math.random().toString(36).slice(2, 10);
};

const register = async ({ email, password, retypePassword }) => {
    const user = await userModel.findOne({ email })
    if (user) {
        throw new ConflictError('Email đã được sử dụng')
    }
    if (retypePassword !== password) {
        throw new BadRequestError('Mật khẩu không trùng khớp')
    }
    const verificationCode = generateVerificationCode()
    await sendVerificationCode(email, verificationCode)
    const exp = parseInt(60)
    return createApiKey({ email, password, verificationCode }, exp)
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
        $or: [{ email: username }, { phoneNumber: username }]
    }).orFail(() => {
        throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác')
    })
    const isPasswordValid = await checkPassword(password, user.password)
    if (!isPasswordValid) {
        throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác')
    }
    const exp = parseInt(60 * 60 * 24)
    return createApiKey({ id: user._id, role: user.role }, exp)
}

const updateUser = async (id, { phoneNumber, address, name }) => {
    const user = await userModel.findByIdAndUpdate(id, { phoneNumber, address, name }, { new: true })
    return user
}

const changePassword = async (id, { password, newPassword, retypeNewPassword }) => {
    const user = await userModel.findById(id).orFail(new BadRequestError('Không tìm thấy tài khoản'))
    const isPasswordValid = await checkPassword(password, user.password)
    if (!isPasswordValid) {
        throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác')
    }
    if (newPassword !== retypeNewPassword) {
        throw new BadRequestError('Mật khẩu mới không trùng khớp')
    }
    const hashPassword = await createHash(newPassword)
    return await userModel.findByIdAndUpdate(id, { password: hashPassword }, { new: true })
}

const forgotPassword = async (email) => {
    const user = await userModel.findOne({ email }).orFail(new BadRequestError('Không tìm thấy tài khoản'))
    const randomString = generateRandomString();
    const hashPassword = await createHash(randomString)
    await user.updateOne({ password: hashPassword }).orFail(new BadRequestError('Có lỗi xảy ra'))
    return await sendNewPassword(user.email, randomString);
}

export const userService = {
    register,
    createUser,
    login,
    changePassword,
    forgotPassword,
    updateUser
}
