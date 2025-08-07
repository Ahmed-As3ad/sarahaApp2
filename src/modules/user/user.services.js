import UserModel, { roleEnum } from "../../DB/models/User.model.js";
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
export const shareProfile = async (req, res, next) => {
    const { userId } = req.params;
    const user = await UserModel.findOne({ _id: userId, confirmedEmail: true }).select('-_id name email');
    if (!user) {
        throw new Error("User not found or email not confirmed!", { cause: 404 });
    }

    const userObject = user.toObject();

    return res.json({
        message: "Profile retrieved successfully",
        user: userObject
    });
}

export const freezeAccount = async (req, res, next) => {
    const { userId } = req.params;
    
    if (userId && req.user.role !== roleEnum.Admin) {
        throw new Error('Access declined!', { cause: 403 });
    }
    
    const targetUserId = userId || req.user._id;
    
    const user = await UserModel.findOneAndUpdate(
        { _id: targetUserId, deletedAt: { $exists: false } },
        { deletedAt: Date.now(), deletedBy: req.user._id },
        { new: true }
    );
    
    if (!user) {
        throw new Error("User not found or already frozen!", { cause: 404 });
    }
    
    return res.json({ 
        message: "User frozen successfully!", 
        user: user.toObject() 
    });
}