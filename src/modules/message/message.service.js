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
        const { public_id, secure_url } = await fileUpload({ file: req.file, path: `messages/${req.params.receiverId}` });
        const newMessage = await MessageModel.create({
            content,
            senderId: req.user?._id,
            receiverId,
            attachment: { public_id, secure_url }
        });
        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        throw new Error(error, { cause: 500 })
    }
}