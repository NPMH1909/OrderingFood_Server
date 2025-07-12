// import express from "express"
// import dotenv from "dotenv"
// import mongoose from "mongoose"
// import cors from "cors"
// import route from "./src/routes/index.route.js"

// dotenv.config()
// const app = express()
// const port = process.env.PORT
// const MONGODB_URI = process.env.MONGODB_URI
// app.use(express.json())
// app.use(cors())
// route(app)
// const connect = async() => {
//     try {
//         await mongoose.connect(MONGODB_URI)
//         console.log('Connect success')
//         app.listen(port,()=>{
//             console.log(`Listening at port ${port}`)
//         })
//     } catch (error) {
//         console.log(`Error to connect with error: ${error.message}`)
//     }
// }
// connect()

import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import fs from "fs"
import cors from "cors"
import route from "./src/routes/index.route.js"

dotenv.config()
const app = express()
const port = process.env.PORT

// Construct Mongo URI
const DB_URI = process.env.MONGODB_URI

// Load CA certificate
const ca = [fs.readFileSync('./global-bundle.pem')] // 🔁 sửa path nếu để trong /certs

app.use(express.json())
app.use(cors())
route(app)

const connect = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('✅ Connect to Amazon DocumentDB success')

        app.listen(port, () => {
            console.log(`Server listening at port ${port}`)
        })
    } catch (error) {
        console.error(`Failed to connect: ${error.message}`)
    }
}
connect()
