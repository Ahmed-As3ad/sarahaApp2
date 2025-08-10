import tokenRevoke from "../DB/models/Token.model.js";
import UserModel, { roleEnum } from "../DB/models/User.model.js";
import { Signatures, verifyToken } from "../utils/token.method.js";

const auth = () => {
    return async (req, res, next) => {
        const [bearer, token] = req?.headers?.authorization.split(" ") || [];
        console.log({ bearer, token });

        if (!bearer || !token) {
            throw new Error("In-valid Token format", { cause: 401 });
        }

        const signature = Signatures({ signatureKey: bearer })
        const decode = verifyToken({ token, secretKey: signature?.accessSignature })

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
        req.user = user
        req.decode = decode
        return next()
    }
}

export default auth;