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

  // NEW FIELDS
  plan: {
    type: String,
    default: "free", // free | advanced | creator
  },
  expires: {
    type: Date,
    default: null,
  }
});

const User = models?.User || model("User", userSchema);
export default User;