import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    chatID: { type: String, required: true },   // string instead of ObjectId
    userID: { type: String, required: true },   // string instead of ObjectId

    imgName: { type: String },

    userPrompt: { type: String, required: true },
    llmResponse: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);