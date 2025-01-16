import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    attachment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fs.files",
    },
    attachmentType: {
      type: String,  // This will store the type of attachment (image, file, etc.)
      default: "unknown",  // Default to 'unknown' if not specified
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("message", MessageSchema);

export default MessageModel;
