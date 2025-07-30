import mongoose from "mongoose";

export const roleEnum = {
    user: "user",
    Admin: "Admin"
}
export const providerEnum = {
    System: "System",
    Google: "Google"
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
    }
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;