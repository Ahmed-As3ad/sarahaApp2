import Joi from "joi";
import { generalFeilds } from "../../middleware/validation.midleware.js";

export const signup = {
    body: Joi.object({
        name: generalFeilds.name.required(),
        email: generalFeilds.email.required(),
        Password: generalFeilds.Password.required(),
        cPassword: Joi.string().valid(Joi.ref('Password')).required(),
        phone: generalFeilds.phone.required(),
        age: Joi.number().min(18).max(80).required(),
        DOB: Joi.date().less("now").required(),
        gender: generalFeilds.gender.required()
    }).required()
}
export const signin = {
    body: Joi.object({
        email: generalFeilds.email.required(),
        Password: generalFeilds.Password.required(),
    }).required()
}
export const confirmEmail = {
    body: Joi.object({
        email: generalFeilds.email.required(),
        otp: generalFeilds.otp.required()
    })
}