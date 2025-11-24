"use server";

import Chat from "@/app/models/chat.model";
import connectDB from "../utils/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";

const isAuthenticated = (session: any): session is Session => {
  return session && session.user && typeof session.user.id === "string";
};

/* ============================================================
   CREATE CHAT
============================================================ */
export const createChat = async ({
  chatID,
  userID,
  imgName,
  userPrompt,
  llmResponse
}: {
  chatID: string;
  userID: string;
  imgName?: string;
  userPrompt: string;
  llmResponse: string;
}) => {
  try {
    const session = await auth();
    if (!isAuthenticated(session)) throw new Error("User not authenticated");

    await connectDB();

    const data = await Chat.create({
      chatID,
      userID,          // ✔ matches schema
      imgName,
      userPrompt,      // ✔ flat fields
      llmResponse,     // ✔ flat fields
    });

    revalidatePath(`/app/${chatID}`);

    return { success: true, message: JSON.parse(JSON.stringify(data)) };
  } catch (error: any) {
    console.error("createChat Error:", error);
    return { success: false, message: error.message };
  }
};

/* ============================================================
   GET CHAT FOR SIDEBAR
============================================================ */
export const getSidebarChat = async (userID: string) => {
  try {
    await connectDB();

    const data = await Chat.aggregate([
      { $match: { userID } },     // ✔ flat field, no ObjectId
      {
        $group: {
          _id: "$chatID",
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { createdAt: -1 } },
    ]);

    return { success: true, message: JSON.parse(JSON.stringify(data)) };
  } catch (error) {
    console.error("getSidebarChat Error:", error);
    return { success: false };
  }
};

/* ============================================================
   GET CHAT HISTORY
============================================================ */
export const getChatHistory = async ({
  userID,
  chatID,
}: {
  userID: string;
  chatID: string;
}) => {
  try {
    await connectDB();

    const data = await Chat.find({
      userID,
      chatID,
    });

    return { success: true, message: JSON.parse(JSON.stringify(data)) };
  } catch (error) {
    console.error("getChatHistory Error:", error);
    return { success: false };
  }
};

/* ============================================================
   DELETE CHAT
============================================================ */
export const deleteChat = async (chatID: string) => {
  try {
    await connectDB();
    const session = await auth();
    if (!isAuthenticated(session)) throw new Error("User not authenticated");

    const data = await Chat.deleteMany({
      userID: session.user.id,
      chatID,
    });

    revalidatePath("/app");
    return { success: true, message: JSON.parse(JSON.stringify(data)) };
  } catch (error) {
    console.error("deleteChat Error:", error);
    return { success: false };
  }
};