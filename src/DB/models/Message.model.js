import mongoose from "mongoose";
export const ReactionEnum = {
    LIKE: "ThumbsUp",
    LOVE: "HandHeart",
    HAHA: "Laugh",
    ANGERY: "Angry",
    SAD: "HeartCrack",
    REMOVE: "HeartMinus"
}
const MessageSchema = mongoose.Schema({
    content: {
        type: String,
        required: function () {
            return this.attachment.length ? false : true;
        }
    },
    attachment: { public_id: String, secure_url: String },
    Reaction:{
        type: String,
        enum: Object.values(ReactionEnum)
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    receiverId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    favorites: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
})

const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default MessageModel;