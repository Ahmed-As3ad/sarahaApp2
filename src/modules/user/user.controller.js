import { Router } from "express";
import * as userService from './user.services.js'

const router = Router()
router.get('/profile', userService.profile)

export default router