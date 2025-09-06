import { Router } from 'express'
import * as messageService from './message.service.js'
import { validate } from '../../middleware/validation.midleware.js'
import { addMessageFavoriteValidation, removeMessageFavoriteValidation, removeMessageValidation, sendMessageValidation } from './message.validation.js'
import auth from '../../middleware/authentication.js'
import { cloudFileUpload, fileType } from '../../utils/multer/cloud.multer.js'

const router = Router()
router.post('/:receiverId/send', cloudFileUpload({ validation: fileType.image }).single('attachment'), validate(sendMessageValidation), messageService.sendMessage)
router.post('/:receiverId/sender', auth(), cloudFileUpload({ validation: fileType.image }).single('attachment'), validate(sendMessageValidation), messageService.sendMessage)
router.delete('/:messageId', auth(), validate(removeMessageValidation), messageService.removeMessage)
router.get('/messages', auth(), messageService.getMessages)
router.post('/favorites', auth(), validate(addMessageFavoriteValidation), messageService.addMessageFavorite)
router.get('/favorites', auth(), messageService.getFavoriteMessages)
router.delete('/favorites/:messageId', auth(), validate(removeMessageFavoriteValidation), messageService.removeMessageFavorite)
router.post('/:messageId/reaction', auth(), messageService.reactToMessage)
router.delete('/:messageId/reaction', auth(), messageService.removeMessageReaction)

export default router