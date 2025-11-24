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
    setOptimisticPrompt
  } = geminiZustand();

  // Normalize DB messages (Fix to avoid undefined fields)
  const normalizedMessages =
    message?.map((m) => ({
      _id: m._id || Date.now().toString(),
      message: {
        userPrompt: m.message?.userPrompt ?? m.userPrompt ?? "",
        llmResponse: m.message?.llmResponse ?? m.llmResponse ?? "",
        imgName: m.message?.imgName ?? m.imgName ?? undefined,
      },
    })) || [];

  // Optimistic UI state
  const [optimisticChats, addOptimisticChat] = useOptimistic(
    normalizedMessages,
    (state, newChat: MessageProps) => [...state, newChat]
  );

  useEffect(() => {
    if (optimisticPrompt && optimisticResponse) {
      addOptimisticChat({
        _id: Date.now().toString(),
        message: {
          userPrompt: optimisticPrompt,
          llmResponse: optimisticResponse,
          imgName: inputImgName ?? undefined,
        },
      });

      // Reset after adding
      setTimeout(() => {
        setOptimisticPrompt(null);
        setOptimisticResponse(null);
      }, 200);
    }
  }, [optimisticPrompt, optimisticResponse]);

  return (
    <>
      {optimisticChats.map((chat: any) => (
        <div key={chat._id} className="my-16 mt-10">
          <ChatProvider
            chatUniqueId={chat._id}
            imgInfo={{ imgSrc: image, imgAlt: name }}
            imgName={chat.message.imgName}
            llmResponse={chat.message.llmResponse}
            userPrompt={chat.message.userPrompt}
          />
        </div>
      ))}
    </>
  );
};

export default OptimisticChat;