import userRouter from "./user.route.js"

const route = (app) => {
    app.use('/', userRouter)
}

export default route