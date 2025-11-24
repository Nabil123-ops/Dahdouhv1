"use client";

import { MessageProps } from "@/types/types";
import React, { useEffect, useOptimistic } from "react";
import ChatProvider from "./chat-provider";
import geminiZustand from "@/utils/gemini-zustand";

const OptimisticChat = ({
  message,
  name,
  image,
}: {
  message: MessageProps[];
  name: string;
  image: string;
}) => {
  const {
    optimisticPrompt,
    optimisticResponse,
    inputImgName,
    setOptimisticResponse,
    setOptimisticPrompt,
  } = geminiZustand();

  /* ============================================
     NORMALIZE MESSAGES FROM DATABASE
     ============================================ */
  const normalizedMessages =
    message?.map((m) => ({
      _id: m._id || Date.now().toString(),
      chatID: m.chatID,
      userID: m.userID,
      userPrompt: m.userPrompt,
      llmResponse: m.llmResponse,
      imgName: m.imgName,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })) || [];

  /* ============================================
     OPTIMISTIC UI STATE HANDLER
     ============================================ */
  const [optimisticChats, addOptimisticChat] = useOptimistic<MessageProps[]>(
    normalizedMessages
  );

  /* ============================================
     ADD OPTIMISTIC MESSAGE FIXED
     ============================================ */
  useEffect(() => {
    if (optimisticPrompt && optimisticResponse) {
      addOptimisticChat((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          userPrompt: optimisticPrompt,
          llmResponse: optimisticResponse,
          imgName: inputImgName ?? undefined,
        },
      ]);

      // Reset optimistic state
      setTimeout(() => {
        setOptimisticPrompt(null);
        setOptimisticResponse(null);
      }, 150);
    }
  }, [optimisticPrompt, optimisticResponse]);

  /* ============================================
     RENDER MESSAGES
     ============================================ */
  return (
    <>
      {optimisticChats.map((chat) => (
        <div key={chat._id} className="my-16 mt-10">
          <ChatProvider
            chatUniqueId={chat._id}
            imgInfo={{ imgSrc: image, imgAlt: name }}
            imgName={chat.imgName}
            llmResponse={chat.llmResponse}
            userPrompt={chat.userPrompt}
          />
        </div>
      ))}
    </>
  );
};

export default OptimisticChat;