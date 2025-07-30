import express from 'express'
import userController from './modules/user/user.controller.js'
import authController from './modules/auth/auth.controller.js'
import connection from './DB/connection.DB.js'
import path from 'node:path'
import * as dotenv from 'dotenv'
import auth from './middleware/authentication.js'
import { roleEnum } from './DB/models/User.model.js'

const bootstrap = async () => {
    const app = express()
    const port = process.env.PORT || 3000
    app.use(express.json())
    // .ENV
    dotenv.config({ path: path.join('./src/config/.env.dev') })
    // DB 
    connection()


    app.use('/user', auth([roleEnum.Admin]), userController)
    app.use('/auth', authController)
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use((error, req, res, next) => {
        return res.status(error.cause || 500).json({
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : null
        })
    })
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap