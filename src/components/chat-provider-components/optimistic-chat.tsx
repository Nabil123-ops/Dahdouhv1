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

  // FIX: Normalize DB messages → FLAT structure
  const normalizedMessages =
    message?.map((m) => ({
      _id: m._id || Date.now().toString(),

      // FLAT fields
      chatID: m.chatID ?? undefined,
      userID: m.userID ?? undefined,
      userPrompt: m.userPrompt ?? "",
      llmResponse: m.llmResponse ?? "",
      imgName: m.imgName ?? undefined,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })) || [];

  // FIX: Optimistic UI with correct MessageProps structure
  const [optimisticChats, addOptimisticChat] = useOptimistic(
    normalizedMessages,
    (state, newChat: MessageProps) => [...state, newChat]
  );

  useEffect(() => {
    if (optimisticPrompt && optimisticResponse) {
      addOptimisticChat({
        _id: Date.now().toString(),
        chatID: undefined,
        userID: undefined,
        userPrompt: optimisticPrompt,
        llmResponse: optimisticResponse,
        imgName: inputImgName ?? undefined,
      });

      setTimeout(() => {
        setOptimisticPrompt(null);
        setOptimisticResponse(null);
      }, 200);
    }
  }, [optimisticPrompt, optimisticResponse]);

  return (
    <>
      {optimisticChats.map((chat: MessageProps) => (
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