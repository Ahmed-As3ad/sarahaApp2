
import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
    jti: {
        type: String,
        unique: true,
        required: true
    },
    expiresIn: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const tokenRevoke = mongoose.models.TokensRevoke || mongoose.model('TokensRevoke', tokenSchema)
export default tokenRevoke