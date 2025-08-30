import tokenRevoke from "../../DB/models/Token.model.js";
import UserModel, { roleEnum } from "../../DB/models/User.model.js"
import { emailEvent } from "../../utils/events/email.events.js";
import { compare, generateCrypto, generateHash } from "../../utils/security/hash.method.js";
import { generateToken, Signatures } from "../../utils/token.method.js";
import { customAlphabet, nanoid } from 'nanoid'


export const typesEnum = {
    bearer: "bearer",
    Admin: "Admin"
}

export const signUp = async (req, res, next) => {
    const { name, email, Password, cPassword, Phone, DOB } = req.body
    if (Password !== cPassword) {
        throw new Error("confirm Password didn't match Password");

    }
    if (await UserModel.findOne({ email })) {
        throw new Error("User already Exist!", { cause: 409 });
    }
    const hashPassword = generateHash({ password: Password })
    const cryptoPhone = generateCrypto({ phone: Phone })

    const otp = customAlphabet('1234567890', 6)()
    const confirmEmailOTP = generateHash({ password: otp })
    const newUser = await UserModel.create({ name, email, confirmEmailOTP, Password: hashPassword, Phone: cryptoPhone, DOB });

    emailEvent.emit("confirm-Email", {
        to: email,
        name,
        otp
    });

    res.status(201).json({ message: "User Created Successfully.", newUser })
}

export const Login = async (req, res, next) => {
    const { email, Password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error("In-valid Email or Password.", { cause: 401 })
    }

    if (user.deletedAt && user.deletedAt !== null) {
        throw new Error("Account Frozen! Please contact the Administrators", { cause: 403 });
    }

    const isPasswordValid = compare({
        password: Password,
        hashedPassword: user.Password
    });

    if (!isPasswordValid) {
        throw new Error("In-valid Email or Password.", { cause: 401 })
    }

    if (!user.confirmedEmail) {
        throw new Error("You should verify Email First!", { cause: 409 });
    }

    const signature = Signatures({ signatureKey: user.role != roleEnum.user ? typesEnum.Admin : typesEnum.bearer })
    const jwtid = nanoid()
    const access_token = generateToken({
        payload: { id: user._id },
        secretKey: signature.accessSignature,
        options: { expiresIn: +process.env.ACCESS_EXPIRES_IN || '1hr', jwtid }
    });
    const refresh_token = generateToken({
        payload: { id: user._id },
        secretKey: signature.refreshSignature,
        options: { expiresIn: +process.env.REFRESH_EXPIRES_IN || '7d' }
    });
    return res.json({ message: "logged Successfully.", access_token, refresh_token })
}

export const confirmEmail = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("User not found!", { cause: 404 });
    }

    if (user.confirmedEmail === true) {
        throw new Error("Email already verified!", { cause: 409 });
    }

    const isOtpValid = compare({ password: otp, hashedPassword: user.confirmEmailOTP });
    if (!isOtpValid) {
        throw new Error("In-valid OTP", { cause: 409 })
    }

    const updatedUser = await UserModel.updateOne(
        { email },
        {
            $set: { confirmedEmail: true },
            $unset: { confirmEmailOTP: 1 },
            $inc: { __v: 1 }
        }
    );

    if (updatedUser.matchedCount) {
        res.json({ message: "Email confirmed successfully!" });
    } else {
        throw new Error("Fail to update User", { cause: 409 });
    }
}

export const logout = async (req, res, next) => {
    try {
        const token = req.decode;
        await tokenRevoke.create({
            jti: token?.jti,
            expiresIn: token?.iat + Number(process.env.REFRESH_EXPIRES_IN),
            userId: token?.id
        })
        res.json({ message: 'logout Successful.' })
    } catch (error) {
        throw new Error(error, { cause: 400 })
    }

}