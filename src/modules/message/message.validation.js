import Joi from 'joi';
import { Types } from 'mongoose';
import { fileType } from '../../utils/multer/multer.utli.js';
import { generalFeilds } from '../../middleware/validation.midleware.js';

export const sendMessageValidation = {
    params: Joi.object({
        receiverId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Account!');
            }
            return value;
        }).required()
    }),

    body: Joi.object().keys({
        content: Joi.string().min(2).max(10000),
    }).required(),

    files: Joi.array().items(Joi.object({
        fieldname: generalFeilds.fieldname.valid('attachment').required(),
        originalname: generalFeilds.originalname.required(),
        encoding: generalFeilds.encoding.required(),
        mimetype: generalFeilds.mimetype.valid(...fileType.image).required(),
        destination: generalFeilds.destination.required(),
        filename: generalFeilds.filename.required(),
        path: generalFeilds.path.required(),
        size: generalFeilds.size.required()
    }))
}
export const addMessageFavoriteValidation = {
    body: Joi.object().keys({
        messageId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Message ID!');
            }
            return value;
        }).required()
    })
}

export const removeMessageFavoriteValidation = {
    body: Joi.object().keys({
        messageId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Message ID!');
            }
            return value;
        }).required()
    })
}
export const removeMessageValidation = {
    params: Joi.object({
        messageId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Message ID!');
            }
            return value;
        }).required()
    })
}