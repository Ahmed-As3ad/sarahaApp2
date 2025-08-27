import { Router } from "express";
import * as userService from './user.services.js'
import { validate } from "../../middleware/validation.midleware.js";
import { idValidation, profile, updatedPassword, forgotPassword, resetPassword } from "./user.validation.js";
import { authorization } from "../../middleware/authorization.js";
import auth from "../../middleware/authentication.js";
import { endpoint } from "./endpoint.js";
import { fileType} from "../../utils/multer/multer.utli.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";

const router = Router()
router.get('/profile', validate(profile), auth(), authorization({ accessRoles: [endpoint.profile] }), userService.profile)
router.post('/profile-image', auth(), cloudFileUpload({ validation:fileType.image }).single('Image'), userService.changeProfileImage)
router.get('/:userId/share', validate(profile), userService.shareProfile)
router.delete('{/:userId}/freeze', auth(), validate(idValidation), userService.freezeAccount)
router.patch('{/:userId}/unfreeze', auth(), validate(idValidation), userService.unFreezeAccount)
router.patch('/update-Password', auth(), validate(updatedPassword), userService.updatePassword)
router.post('/forgot-Password', validate(forgotPassword), userService.forgotPassword)
router.patch('/reset-Password', validate(resetPassword), userService.resetPassword)
router.delete('/delete', auth(), authorization({ accessRoles: [endpoint.deleteAcc] }), validate(idValidation), userService.deleteAcc)

export default router