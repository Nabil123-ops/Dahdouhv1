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

  // 🟢 Normalized messages — KEEP FLAT STRUCTURE
  const normalizedMessages = message?.map((m) => ({
    _id: m._id || Date.now().toString(),
    chatID: m.chatID,
    userID: m.userID,
    userPrompt: m.userPrompt,
    llmResponse: m.llmResponse,
    imgName: m.imgName,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  })) || [];

  // 🟢 Optimistic UI
  const [optimisticChats, addOptimisticChat] = useOptimistic<MessageProps[]>(
    normalizedMessages
  );

  // 🟢 Add optimistic message
  useEffect(() => {
    if (optimisticPrompt && optimisticResponse) {
      addOptimisticChat({
        _id: Date.now().toString(),
        userPrompt: optimisticPrompt,
        llmResponse: optimisticResponse,
        imgName: inputImgName ?? undefined,
      });

      // reset
      setTimeout(() => {
        setOptimisticPrompt(null);
        setOptimisticResponse(null);
      }, 200);
    }
  }, [optimisticPrompt, optimisticResponse]);

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