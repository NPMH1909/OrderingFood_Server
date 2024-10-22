import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import route from "./src/routes/index.route.js"

dotenv.config()
const app = express()
const port = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
app.use(express.json())
app.use(cors())
route(app)
const connect = async() => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connect success')
        app.listen(port,()=>{
            console.log(`Listening at port ${port}`)
        })
    } catch (error) {
        console.log(`Error to connect with error: ${error.message}`)
    }
}
connect()