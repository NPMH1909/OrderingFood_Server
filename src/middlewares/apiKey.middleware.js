import jwt from "jsonwebtoken"
import { Response } from "../utils/response.js"
import { CommonUtils } from "../utils/common.util.js"
import { BadRequestError } from "../errors/badRequest.error.js"
import { ForbiddenRequestError } from "../errors/forbiddenRequest.error.js"
import { UnAuthorizedError } from "../errors/unauthorizedRequest.error.js"
import { NotFoundError } from "../errors/notFound.error.js"
import userModel from "../models/user.model.js"

export const createApiKey = (data, exp) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 1 * exp,
      data
    },
    'secret'
  )
  return token
}

export const verifyToken = (token, verificationCode) => {
  const decoded = jwt.verify(token, 'secret')
  if (!decoded) {
    throw new BadRequestError('Token không hợp lệ hoặc đã hết hạn');
  }
  if (decoded.data.verificationCode !== verificationCode) {
    throw new BadRequestError('Mã xác thực không đúng');
  }
  return {
    email: decoded.data.email,
    password: decoded.data.password,
  }
};


export const requireApiKey = async (req, res, next) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.headers.authorization)) {
      throw new UnAuthorizedError('Bạn cần đăng nhập 1')
    }
    const apiKey = req.headers.authorization.split(' ')[1]

    jwt.verify(apiKey, 'secret', async (err, decoded) => {
      try {
        if (err || !decoded) {
          throw new UnAuthorizedError('Bạn cần đăng nhập 2')
        } else {
          const result = await userModel.findById(decoded.data.id)
          if (CommonUtils.checkNullOrUndefined(result)) {
            throw new NotFoundError('Người dùng không tồn tại')
          }
          req.user = {
            id: decoded.data.id,
            role: decoded.data.role
          }
          next()
        }
      } catch (error) {
        next(new Response(error.statusCode || 500, error.message, null).responseHandler(res))
      }
    })
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).responseHandler(res))
  }
}

export const authenticationAdmin = async (req, res, next) => {
  try {

    if (
      CommonUtils.checkNullOrUndefined(req.user) ||
      CommonUtils.checkNullOrUndefined(req.user.role) ||
      CommonUtils.checkNullOrUndefined(req.user.id)
    ) {
      throw new UnAuthorizedError('Bạn cần đăng nhập 3')
    }
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenRequestError('Bạn không có quyền truy cập')
    }
    next()
  } catch (error) {
    next(new Response(error.statusCode || 500, error.message, null).responseHandler(res))
  }
}