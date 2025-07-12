import cartRouter from "./cart.route.js"
import CheckRouter from "./check.route.js"
import contactRouter from "./contact.route.js"
import menuItemRouter from "./menuItem.route.js"
import orderRouter from "./order.route.js"
import paymentRouter from "./payment.route.js"
import userRouter from "./user.route.js"

const route = (app) => {
    app.use('/', userRouter)
    app.use('/menu', menuItemRouter)
    app.use('/orders', orderRouter)
    app.use('/payment', paymentRouter)
    app.use('/carts', cartRouter)
    app.use('/contact',contactRouter)
    app.use('/healthy', CheckRouter)
}

export default route