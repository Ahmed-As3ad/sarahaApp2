import express from 'express'
import userController from './modules/user/user.controller.js'
import authController from './modules/auth/auth.controller.js'
import connection from './DB/connection.DB.js'
import path from 'node:path'
import * as dotenv from 'dotenv'

const bootstrap = async () => {
    const app = express()
    const port = process.env.PORT || 3000
    app.use(express.json())
    // .ENV
    dotenv.config({ path: path.join('./src/config/.env.dev') })
    // DB 
    connection()

    app.use('/user', userController)
    app.use('/auth', authController)

    app.use((error, req, res, next) => {
        return res.status(error?.cause || 500).json({
            message: error.message,
            stack: process.env.MOOD === "DEV" ? error?.stack : null
        })
    })
    app.get('/',(req,res,next)=>{res.json({message:'hello world!'})})
    app.listen(port, () => console.log(`http://localhost:${port}`))
}
export default bootstrap