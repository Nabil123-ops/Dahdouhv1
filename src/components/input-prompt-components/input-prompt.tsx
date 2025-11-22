"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import geminiZustand from "@/utils/gemini-zustand";
import { useParams, useRouter } from "next/navigation";
import { createChat } from "@/actions/actions";
import { nanoid } from "nanoid";
import { useMeasure } from "react-use";
import { User } from "next-auth";
import InputActions from "./input-actions";
import Link from "next/link";
import { MdImageSearch } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const InputPrompt = ({ user }: { user?: User }) => {
  const {
    currChat,
    setCurrChat,
    setToast,
    customPrompt,
    setInputImgName,
    inputImgName,
    setMsgLoader,
    optimisticResponse,
    setOptimisticResponse,
    geminiApiKey,
  } = geminiZustand();

  const [inputImg, setInputImg] = useState<File | null>(null);
  const { chat } = useParams();
  const router = useRouter();
  const [ref, { height }] = useMeasure<HTMLTextAreaElement>();
  const chatID = (chat as string) || nanoid();
  const cancelRef = useRef(false);

  // ---------------------------------------------
  // ⭐ GENERATE MESSAGE
  // ---------------------------------------------
  const generateMsg = useCallback(async () => {
    if (!currChat.userPrompt?.trim() || !user) {
      setToast("Please sign in to use Dahdouh AI.");
      return;
    }

    router.push(`/app/${chatID}#new-chat`);

    const date = new Date().toISOString().split("T")[0];
    const rawPrompt = currChat.userPrompt;

    const detailedPrompt = `
User Query:
${rawPrompt}
    
AI Instructions:
You are Dahdouh AI, a helpful, smart, friendly assistant. Provide clear answers in Arabic or English. No Google Gemini branding. Be accurate, polite, and direct.
Date: ${date}
`;

    try {
      setMsgLoader(true);
      let text = "";

      // ♻️ Placeholder response until backend model is added
      text = "Dahdouh AI is processing your request… (Model integration needed)";

      setOptimisticResponse(text);
      setCurrChat("llmResponse", text);
  
      // Save message to DB
      await createChat({
        chatID,
        userID: user?.id as string,
        llmName: inputImgName ?? undefined,
        userPrompt: rawPrompt,
        llmResponse: text,
      });
    } catch (error: any) {
      console.log("Error:", error);
      setToast(`Error: ${error.message}`);
    } finally {
      setMsgLoader(false);
      setInputImg(null);
      setInputImgName(null);
      setCurrChat("userPrompt", null);
    }
  }, [
    currChat.userPrompt,
    user,
    chatID,
    inputImg,
    geminiApiKey,
    setToast,
    setCurrChat,
    setMsgLoader,
    setOptimisticResponse,
  ]);

  // ---------------------------------------------
  // Handle input changes
  // ---------------------------------------------
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrChat("userPrompt", e.target.value);
    },
    [setCurrChat]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!user) return setToast("Please sign in to use Dahdouh AI.");
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        generateMsg();
      }
    },
    [user, generateMsg, setToast]
  );

  // ---------------------------------------------
  // Image upload
  // ---------------------------------------------
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files?.[0]) {
      const file = event.target.files[0];
      setInputImg(file);
      setInputImgName(file.name);
    }
  };

  return (
    <div className="flex-shrink-0 w-full md:px-10 px-5 pb-2 space-y-2 bg-white dark:bg-[#131314]">
      {/* Uploaded image preview */}
      {inputImg && (
        <div className="max-w-4xl overflow-hidden w-full mx-auto">
          <div className="p-5 bg-rtlLight dark:bg-rtlDark rounded-t-3xl flex items-start gap-2">
            <MdImageSearch className="text-4xl" />
            <p className="text-lg font-semibold truncate">{inputImgName}</p>

            <IoMdClose
              onClick={() => {
                setInputImgName(null);
                setInputImg(null);
              }}
              className="absolute top-1 right-1 text-2xl rounded-full cursor-pointer hover:opacity-80 hover:text-red-500"
            />
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="max-w-4xl mx-auto w-full">
        <textarea
          name="prompt"
          ref={ref}
          disabled={false}
          placeholder={
            customPrompt?.placeholder
              ? customPrompt.placeholder
              : "Ask Dahdouh AI anything…"
          }
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          value={optimisticResponse ? "" : currChat.userPrompt || ""}
          className="w-full bg-transparent p-4 text-lg outline-none resize-none border rounded-2xl border-gray-300 dark:border-gray-600"
          rows={1}
        />
      </div>

      <InputActions
        handleCancel={() => null}
        handleImageUpload={handleImageUpload}
        generateMsg={generateMsg}
      />
    </div>
  );
};

export default InputPrompt;