import { Router } from "express";
import * as authService from './auth.services.js'

const router = Router()
router.post('/signup', authService.signUp)
router.post('/signin', authService.Login)

export default router