import menuItemRouter from "./menuItem.route.js"
import userRouter from "./user.route.js"

const route = (app) => {
    app.use('/', userRouter)
    app.use('/menu', menuItemRouter)
}

export default route