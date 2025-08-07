import { Router } from "express";
import * as userService from './user.services.js'
import { validate } from "../../middleware/validation.midleware.js";
import { freezeValidation, profile } from "./user.validation.js";
import { authorization } from "../../middleware/authorization.js";
import auth from "../../middleware/authentication.js";
import { endpoint } from "./endpoint.js";

const router = Router()
router.get('/profile', validate(profile), auth(), authorization({ accessRoles: [endpoint.profile] }), userService.profile)
router.get('/:userId/share', validate(profile), userService.shareProfile)
router.delete('{/:userId}', auth(), validate(freezeValidation), userService.freezeAccount)

export default router