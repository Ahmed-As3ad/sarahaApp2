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
        }).required()
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