import { Router } from 'express'
import * as messageService from './message.service.js'
import { validate } from '../../middleware/validation.midleware.js'
import { sendMessageValidation } from './message.validation.js'
import auth from '../../middleware/authentication.js'
import { localFileUpload } from '../../utils/multer/multer.utli.js'
import { cloudFileUpload, fileType } from '../../utils/multer/cloud.multer.js'

const router = Router()
router.post('/:receiverId/send',cloudFileUpload({ validation:fileType.image }).single('attachment'),validate(sendMessageValidation), messageService.sendMessage)

router.post('/:receiverId/sender', auth(), cloudFileUpload({ validation:fileType.image }).single('attachment'), validate(sendMessageValidation), messageService.sendMessage)
export default router