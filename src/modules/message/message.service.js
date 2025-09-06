import MessageModel from "../../DB/models/Message.model.js";
import UserModel from "../../DB/models/User.model.js";
import { fileUpload } from "../../utils/multer/cloudinary.js";

export const sendMessage = async (req, res, next) => {
    try {
        if (!req.body.content && !req.file) {
            return res.status(400).json({ error: "Content or attachment is required." });
        }
        const { receiverId } = req.params;
        const content = req.body?.content || req.body?.message;

        const receiver = await UserModel.findOne({ _id: receiverId, confirmedEmail: { $exists: true }, deletedAt: { $exists: false } });
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found." });
        }
        
        let attachment = null;
        if (req.file) {
            const { public_id, secure_url } = await fileUpload({ file: req.file, path: `messages/${req.params.receiverId}` });
            attachment = { public_id, secure_url };
        }
        
        const newMessage = await MessageModel.create({
            content,
            senderId: req.user?._id,
            receiverId,
            attachment
        });
        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const messages = await MessageModel.find({ receiverId: req.user?._id });
        res.status(200).json({ message: "Messages retrieved successfully", data: messages });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}

export const addMessageFavorite = async (req, res, next) => {
    try {
        const { messageId } = req.body;
        if (!messageId) {
            return res.status(400).json({ error: "Message ID is required." });
        }
        const message = await MessageModel.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }
        message.favorites.push(req.user?._id);
        await message.save();
        res.status(200).json({ message: "Message added to favorites successfully.", data: message });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}
export const getFavoriteMessages = async (req, res, next) => {
    try {
        const messages = await MessageModel.find({ favorites: req.user?._id });
        res.status(200).json({ message: "Favorite messages retrieved successfully", data: messages });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}
export const removeMessageFavorite = async (req, res, next) => {
    try {
        const {messageId} = req.params;
        const message = await MessageModel.findById(messageId);
        message.favorites.pull(req.user?._id);
        await message.save();
        res.status(200).json({ message: "Message removed from favorites successfully.", data: message });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}
export const removeMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const message = await MessageModel.findByIdAndDelete(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found." });
        }
        res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}
export const reactToMessage = async (req, res, next) => {
    try {
        const {reactEmoji} = req.body;
        const { messageId } = req.params;
        const message = await MessageModel.findOneAndUpdate(
            { _id: messageId },
            { $set: { Reaction: reactEmoji } },
            { new: true }
        );
        res.status(200).json({ message: "Message reacted successfully.", data: message });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}
export const removeMessageReaction = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const message = await MessageModel.findByIdAndUpdate(
            messageId,
            { $set: { Reaction: null } },
            { new: true }
        );
        res.status(200).json({ message: "Message reaction removed successfully.", data: message });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}