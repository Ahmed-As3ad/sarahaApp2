import jwt from 'jsonwebtoken'
import { roleEnum } from '../DB/models/User.model.js';
import { typesEnum } from '../modules/auth/auth.services.js';
export const generateToken = ({ payload = {}, secretKey = "", options = {} } = {}) => {
    const token = jwt.sign(payload, secretKey, options);
    return token
}
export const verifyToken = ({ token = "", secretKey = "" } = {}) => {
    const decoded = jwt.verify(token, secretKey);
    return decoded
}


export const Signatures = ({ signatureKey = typesEnum.bearer} = {}) => {
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