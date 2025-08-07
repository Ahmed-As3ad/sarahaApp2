import Joi from "joi";
import { genderEnum } from "../DB/models/User.model.js";
export const generalFeilds = {
    name: Joi.string().min(2).max(20),
    email: Joi.string().email(),
    Password: Joi.string().alphanum().min(9).max(20),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/),
    gender: Joi.string().valid(...Object.values(genderEnum)).insensitive().lowercase(),
    otp: Joi.string().regex(/^\d{4}$/)
}

export const validate = (schema) => {
    return (req, res, next) => {
        const validationError = [];
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], { abortEarly: false })
            if (validationResult.error) {
                validationError.push({ key, details: validationResult.error.details })
            }

        }

        if (validationError.length) {
            return res.status(400).json({ message: "validation Error!", validationError })
        }

        next()
    }
}