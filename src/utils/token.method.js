import jwt from 'jsonwebtoken'
import UserModel, { roleEnum } from '../DB/models/User.model.js';
import { typesEnum } from '../modules/auth/auth.services.js';
import tokenRevoke from '../DB/models/Token.model.js';
import { nanoid } from 'nanoid';

export const tokenTypesEnum = {
    access: "access",
    refresh: "refresh"
};

export const generateToken = ({ payload = {}, secretKey = "", options = {} } = {}) => {
    const token = jwt.sign(payload, secretKey, options);
    return token
}
export const verifyToken = ({ token = "", secretKey = "" } = {}) => {
    const decoded = jwt.verify(token, secretKey);
    return decoded
}


export const Signatures = ({ signatureKey = typesEnum.bearer } = {}) => {
    // console.log("signature is: ", signatureKey);
    let signature = { accessSignature: undefined, refreshSignature: undefined }

    switch (signatureKey) {
        case typesEnum.Admin:
            signature.accessSignature = process.env.ACCESS_TOKEN_SYSTEM_SIGNATURE;
            signature.refreshSignature = process.env.REFRESH_TOKEN_SYSTEM_SIGNATURE;
            // console.log("Admin: ", signature.accessSignature);

            break;

        default:
            signature.accessSignature = process.env.ACCESS_TOKEN_BEARER_SIGNATURE;
            signature.refreshSignature = process.env.REFRESH_TOKEN_BEARER_SIGNATURE;
            // console.log("User: ", signature.accessSignature);
            break;
    }
    return signature
}

export const decodeToken = async ({ next, authorization = "", tokenType = tokenTypesEnum.access, refreshToken = null } = {}) => {
    const [bearer, token] = authorization.split(" ") || [];
    console.log({ bearer, token });

    if (!bearer || !token) {
        throw new Error("In-valid Token format", { cause: 401 });
    }

    const signature = Signatures({ signatureKey: bearer })
    const decode = verifyToken({
        token,
        secretKey: tokenType === tokenTypesEnum.access ? signature?.accessSignature : signature?.refreshSignature
    })

    if (!decode?.id) {
        return next(new Error('In-valid Token.', { cause: 401 }))
    }

    if (decode.jti && await tokenRevoke.findOne({ jti: decode?.jti })) {
        throw new Error('In-valid token, please login!', { cause: 401 })
    }

    const user = await UserModel.findById(decode.id)
    if (!user) {
        return next(new Error('User not found or not registered.', { cause: 404 }))
    }

    return { user, decode }
}

export const generateCredentials = (user) => {
    const signature = Signatures({ signatureKey: user.role != roleEnum.user ? typesEnum.Admin : typesEnum.bearer })
    const jwtid = nanoid()
    const access_token = generateToken({
        payload: { id: user._id, email: user.email, role: user.role },
        secretKey: signature.accessSignature,
        options: { expiresIn: +process.env.ACCESS_EXPIRES_IN || '1hr', jwtid }
    });
    const refresh_token = generateToken({
        payload: { id: user._id, email: user.email, role: user.role },
        secretKey: signature.refreshSignature,
        options: { expiresIn: +process.env.REFRESH_EXPIRES_IN || '7d' }
    });
    return { access_token, refresh_token }
}