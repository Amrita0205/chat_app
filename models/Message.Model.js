import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    }, // For one-to-one
    group: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    }, // For group chat
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

MessageSchema.index({ sender: 1, recipient: 1, group: 1, timestamp: -1 });
const Message=mongoose.model("Message", MessageSchema);
export default Message;
