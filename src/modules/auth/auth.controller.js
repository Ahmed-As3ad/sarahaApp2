import { Router } from "express";
import * as authService from './auth.services.js'
import { validate } from "../../middleware/validation.midleware.js";
import { confirmEmail, signin, signup } from "./authValidation.js";
import auth from "../../middleware/authentication.js";

const router = Router()
router.post('/signup', validate(signup), authService.signUp)
router.post('/login', validate(signin), authService.Login)
router.patch('/confirm-Email', validate(confirmEmail), authService.confirmEmail)
router.post('/logout', auth(), authService.logout)

export default router