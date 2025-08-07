import { Router } from "express";
import * as authService from './auth.services.js'
import { validate } from "../../middleware/validation.midleware.js";
import { confirmEmail, signin, signup } from "./authValidation.js";

const router = Router()
router.post('/signup', validate(signup), authService.signUp)
router.post('/login',validate(signin), authService.Login)
router.patch('/confirm-Email', validate(confirmEmail),authService.confirmEmail)

export default router