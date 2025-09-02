import Joi from "joi";
import { Types } from "mongoose";
import { generalFeilds } from "../../middleware/validation.midleware.js";

export const profile = {
    params: Joi.object({
        userId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Account!');
            }
            return value;
        })
    })
}

export const idValidation = {
    params: Joi.object({
        userId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Account!');
            }
            return value;
        })
    }),
    body: Joi.object({
        userId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Account!');
            }
            return value;
        })
    })
}

export const updatedPassword = {
    body:Joi.object({
        oldPassword: generalFeilds.Password.required(),
        newPassword: generalFeilds.Password.required(),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).messages({
            "any.only":"confirm Password didn't match new Password!"
        }).required()
    }).required()
}

export const forgotPassword = {
    body:Joi.object({
        email: generalFeilds.email.required(),
    }).required()
}
export const resetPassword = {
    body:Joi.object({
        email: generalFeilds.email.required(),
        newPassword:generalFeilds.Password.required(),
        cPassword:Joi.string().valid(Joi.ref('newPassword')).messages({
            "any.only":"confirm Password didn't match new Password!"
        }).required(),
        otp:generalFeilds.otp.required()
    }).required()
}

export const searchUserName = {
    query: Joi.object({
        username: Joi.string().min(1).max(30).optional().allow('')
    })
}
export const setBio = {
    body: Joi.object({
        bio: Joi.string().min(2).max(500).required()
    })
}