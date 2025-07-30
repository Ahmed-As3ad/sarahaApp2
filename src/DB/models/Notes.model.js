import mongoose from "mongoose";

const NotesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v !== v.toUpperCase();
            },
            message: 'Title cannot be entirely uppercase'
        }
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true
    },
}, {
    timestamps: true
})

const NotesModel = mongoose.models.Notes || mongoose.model("Notes", NotesSchema);
export default NotesModel;