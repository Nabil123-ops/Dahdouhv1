import { Schema, model, models } from "mongoose";

export type Plan = "free" | "advanced" | "creator";

export interface IUser {
  username: string;
  email: string;
  image: string;
  plan: Plan;
  expires: Date | null;
}

const userSchema = new Schema<IUser>(
  {
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

    // 🚀 Subscription Plan
    plan: {
      type: String,
      enum: ["free", "advanced", "creator"], // 🔒 prevents invalid plan values
      default: "free",
    },

    // 🚀 Subscription Expiration
    expires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", userSchema);
export default User;