import menuItemRouter from "./menuItem.route.js"
import orderRouter from "./order.route.js"
import userRouter from "./user.route.js"

const route = (app) => {
    app.use('/', userRouter)
    app.use('/menu', menuItemRouter)
    app.use('/order', orderRouter)
}

export default route