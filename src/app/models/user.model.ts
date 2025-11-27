import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },

  //-------------------------
  // SUBSCRIPTION FIELDS
  //-------------------------
  plan: {
    type: String,
    default: "free", // free | advanced | creator
  },
  expires: {
    type: Date,
    default: null,
  },

  //-------------------------
  // USAGE LIMITS
  //-------------------------

  // Track messages per day
  messagesUsedToday: {
    type: Number,
    default: 0,
  },

  // Last date messages were counted
  messagesDate: {
    type: String, // store: "2025-11-27"
    default: "",
  },

  // Image generation usage (Creator plan)
  imagesUsed: {
    type: Number,
    default: 0,
  },

  // Video generation (for future)
  videosUsed: {
    type: Number,
    default: 0,
  },
});

const User = models?.User || model("User", userSchema);
export default User;