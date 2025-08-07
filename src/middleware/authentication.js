import UserModel, { roleEnum } from "../DB/models/User.model.js";
import { Signatures, verifyToken } from "../utils/token.method.js";

const auth = (accessRoles = []) => {
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

        const user = await UserModel.findById(decode.id)
        if (!user) {
            return next(new Error('User not found or not registered.', { cause: 404 }))
        }
        req.user = user
        return next()
    }
}

export default auth;