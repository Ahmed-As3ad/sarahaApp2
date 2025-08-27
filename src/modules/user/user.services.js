import { customAlphabet } from "nanoid";
import UserModel, { roleEnum } from "../../DB/models/User.model.js";
import { emailEvent } from "../../utils/events/email.events.js";
import { compare, generateHash, verifyCrypto } from "../../utils/security/hash.method.js";
import { destroyFile, fileUpload } from "../../utils/multer/cloudinary.js";

export const profile = async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select('-Password');
    if (!user) {
        throw new Error("User not found!", { cause: 404 });
    }
let decryptedPhone;
    if (user.Phone) {
        decryptedPhone = verifyCrypto({ phone: user?.Phone });
        console.log(decryptedPhone) 
    }

    const userObject = user.toObject();
    console.log(userObject);
    
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

    if (userId && req?.user?.role !== roleEnum.Admin) {
        throw new Error('Access declined!', { cause: 403 });
    }

    const user = await UserModel.findOneAndUpdate(
        { _id: userId || req?.user?._id, deletedAt: { $exists: false } },
        { deletedAt: Date.now(), deletedBy: req?.user?._id },
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

export const unFreezeAccount = async (req, res, next) => {
    const { userId } = req.params;
    if (userId && req?.user?.role !== roleEnum.Admin) {
        throw new Error('Access declined!', { cause: 403 })
    }
    const user = await UserModel.findOneAndUpdate(
        { _id: userId || req?.user?._id, deletedAt: { $exists: true } },
        { $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true })

    if (!user) {
        throw new Error('Fail to unfreeze account.', { cause: 400 })
    }
    return res.json({ message: 'Account unfreeze successful!', user })
}

export const deleteAcc = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        throw new Error('User ID required!', { cause: 400 })
    }

    const user = await UserModel.findOneAndDelete({ _id: userId, deletedAt: { $exists: false } })
    if (!user) {
        throw new Error('In-valid User or Account has been Frozen!', { cause: 409 })
    }
    return res.json({ message: "Account Deleted successful!" })
}

export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword, cPassword } = req.body;
    const isOldPasswordCorrect = compare({ password: oldPassword, hashedPassword: req?.user?.Password })
    if (!isOldPasswordCorrect) {
        throw new Error('In-valid old Password!', { cause: 400 })
    }
    const hashedNewPassword = generateHash({ password: newPassword })
    const user = await UserModel.findOneAndUpdate(
        { _id: req?.user?._id },
        { Password: hashedNewPassword },
        { new: true }
    ).select('-Password');
    if (!user) {
        throw new Error('User not found!', { cause: 404 });
    }

    return res.json({
        message: "Password updated successfully!",
    });
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const userExist = await UserModel.findOne({ email })
    if (!userExist) {
        throw new Error('In-valid Email!', { cause: 404 })
    }
    const otp = customAlphabet('1234567890', 4)()
    const confirmEmailOTP = generateHash({ password: otp })
    const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
            confirmEmailOTP,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error('Failed to save OTP!', { cause: 500 });
    }
    emailEvent.emit("confirm-Email", {
        to: email,
        otp
    });

    return res.json({ message: "confirmation otp sent to your Email!" })

}

export const resetPassword = async (req, res, next) => {
    const { email, newPassword, cPassword, otp } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('In-valid Email!');
    }
    if (user.otpExpiry && new Date() > user.otpExpiry) {
        throw new Error('OTP has expired!', { cause: 410 });
    }

    const isOtpValid = compare({ password: otp, hashedPassword: user?.confirmEmailOTP });
    if (!isOtpValid) {
        throw new Error("In-valid OTP", { cause: 409 });
    }
    const hashedNewPasswordReset = generateHash({ password: newPassword });
    const updatePassword = await UserModel.updateOne(
        { email },
        {
            $unset: { confirmEmailOTP: 1 },
            $inc: { __v: 1 },
            Password: hashedNewPasswordReset
        },
        { new: true }
    );
    if (updatePassword.matchedCount === 0) {
        throw new Error('Failed to update password!', { cause: 500 });
    }

    return res.json({ message: "Updated Password Sussccful!" })


}

export const changeProfileImage = async (req, res, next) => {
    if (!req.file) {
        throw new Error('Image is required!', { cause: 400 })
    }
    const { public_id, secure_url } = await fileUpload({ file: req.file, path: `PF/${req.user?._id}` })
    const oldUser = await UserModel.findByIdAndUpdate(req.user?._id, { profileImage: { public_id, secure_url } }, { new: false })
    if (oldUser?.profileImage?.public_id) {
        await destroyFile({ public_id: oldUser.profileImage.public_id })
    }

    const updatedUser = await UserModel.findById(req.user?._id).select('-Password')
    res.json({ message: "Profile image updated successfully!", data: updatedUser })
}   