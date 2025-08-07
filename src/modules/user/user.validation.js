import Joi from "joi";
import { Types } from "mongoose";

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
export const  freezeValidation= {
    params: Joi.object({
        userId: Joi.string().custom((value, helper) => {
            if (!Types.ObjectId.isValid(value)) {
                return helper.message('In-valid Account!');
            }
            return value;
        })
    })
}