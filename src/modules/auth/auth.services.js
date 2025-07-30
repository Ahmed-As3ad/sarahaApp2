import UserModel, { roleEnum } from "../../DB/models/User.model.js"
import { compare, generateCrypto, generateHash } from "../../utils/security/hash.method.js";
import { generateToken, Signatures } from "../../utils/token.method.js";


export const typesEnum = {
    bearer: "bearer",
    Admin: "Admin"
}

export const signUp = async (req, res, next) => {
    const { name, email, Password, cPassword, Phone, age } = req.body
    if (Password !== cPassword) {
        throw new Error("confirm Password didn't match Password");

    }
    if (await UserModel.findOne({ email })) {
        throw new Error("User already Exist!", { cause: 409 });
    }
    const hashPassword = generateHash({ password: Password })
    const cryptoPhone = generateCrypto({ phone: Phone })
    const newUser = await UserModel.create({ name, email, Password: hashPassword, Phone: cryptoPhone, age });
    res.status(201).json({ message: "User Created Successfully.", newUser })
}

export const Login = async (req, res, next) => {
    const { email, Password } = req.body;
    const user = await UserModel.findOne({ email });

    const isPasswordValid = compare({
        password: Password,
        hashedPassword: user.Password
    });

    if (!user || !isPasswordValid) {
        throw new Error("In-valid Email or Password.", { cause: 401 })
    }
    const signature = Signatures({ signatureKey: user.role != roleEnum.user ? typesEnum.Admin : typesEnum.bearer })

    const access_token = generateToken({ 
        payload: { id: user._id }, 
        secretKey: signature.accessSignature, 
        options: { expiresIn: process.env.ACCESS_EXPIRE_IN || '1h' } 
    });
    const refresh_token = generateToken({ 
        payload: { id: user._id }, 
        secretKey: signature.refreshSignature, 
        options: { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' } 
    });
    return res.json({ message: "logged Successfully.", access_token, refresh_token })
}