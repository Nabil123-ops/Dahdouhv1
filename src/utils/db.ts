import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "dahdouh_ai", // you can rename this
    });

    isConnected = true;
    console.log("MongoDB Connected ✔");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;