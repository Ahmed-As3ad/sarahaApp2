import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    content: {
        type: String,
        required: function () {
            return this.attachment.length ? false : true;
        }
    },
    attachment: { public_id: String, secure_url: String },
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
    }
}, {
    timestamps: true
})

const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default MessageModel;