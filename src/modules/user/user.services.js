import UserModel from "../../DB/models/User.model.js";
import { verifyCrypto } from "../../utils/security/hash.method.js";

export const profile = async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('-Password');
    if (!user) {
        throw new Error("User not found!", { cause: 404 });
    }

    const decryptedPhone = verifyCrypto({ phone: user.Phone });

    const userObject = user.toObject();
    userObject.Phone = decryptedPhone;

    return res.json({
        message: "Profile retrieved successfully",
        user: userObject
    });
}