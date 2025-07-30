import bcrypt from 'bcryptjs'
import crypto from 'crypto-js'

export const generateHash = ({ password = "" }) => {
    const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUND || 8)
    return hashPassword
}

export const compare = ({ password = "", hashedPassword = "" }) => {
    const isMatch = bcrypt.compareSync(password, hashedPassword)
    return isMatch
}
export const generateCrypto = ({ phone }) => {
    const cryptoPhone = crypto.AES.encrypt(phone, process.env.CryptoHash).toString();
    return cryptoPhone;
}
export const verifyCrypto = ({ phone, salt = process.env.CryptoHash }) => {
    const decryptedPhone = crypto.AES.decrypt(phone, salt).toString(crypto.enc.Utf8);
    return decryptedPhone;
}