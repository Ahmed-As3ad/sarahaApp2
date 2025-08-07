import mongoose from "mongoose";

export const roleEnum = {
    user: "user",
    Admin: "Admin"
}
export const providerEnum = {
    System: "System",
    Google: "Google"
}
export const genderEnum = {
    male: "male",
    female: "female"
}
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        Unique: true
    },
    confirmedEmail: {
        type: Boolean,
        default: false
    },
    confirmEmailOTP: {
        type: String
    },
    Password: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'Age must be at least 18'],
        max: [60, 'Age must be no more than 60']
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.System
    },
    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.male
    },
    deletedAt: Date,
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    restoredAt: Date,
    restoredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;