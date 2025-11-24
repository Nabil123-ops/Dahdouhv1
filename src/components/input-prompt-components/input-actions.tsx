"use client";

import React, { useCallback, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { User } from "next-auth";

// Zustand
import geminiZustand from "@/utils/gemini-zustand";

// Actions
import { createChat } from "@/actions/actions";

// Icons
import { MdImageSearch } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

/* ======================================================
   DAHDOUH AI MODELS
====================================================== */
const MODELS = [
  { label: "Think", id: "dahdouh-think" },
  { label: "Deep", id: "dahdouh-deep" },
  { label: "Flash", id: "dahdouh-flash" },
  { label: "Boom", id: "dahdouh-boom" },
  { label: "Vision", id: "dahdouh-vision" }
];

/* ======================================================
   INPUT COMPONENT
====================================================== */
const InputPrompt = ({ user }: { user?: User }) => {
  const router = useRouter();
  const { chat } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    currChat,
    setCurrChat,
    setToast,
    setMsgLoader,
    setOptimisticResponse,
    chosenModel,
    setChosenModel,
  } = geminiZustand();

  const [inputImg, setInputImg] = useState<File | null>(null);
  const [inputImgName, setInputImgName] = useState<string | null>(null);

  /* ======================================================
     SEND MESSAGE
  ====================================================== */
  const generateMsg = useCallback(async () => {
    const prompt = currChat.userPrompt?.trim();
    if (!prompt) return;

    if (!user) {
      setToast("Please sign in to use Dahdouh AI.");
      return;
    }

    const chatID = (chat as string) || nanoid();
    router.push(`/app/${chatID}`);

    setMsgLoader(true);

    // 1️⃣ CALL GEMINI API
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        model: chosenModel || "dahdouh-ai",
      }),
    });

    const data = await response.json();

    // 2️⃣ UPDATE UI STATE
    if (data.error) {
      setOptimisticResponse("❌ Error: " + data.error);
      setCurrChat("llmResponse", "❌ Error: " + data.error);
    } else {
      setOptimisticResponse(data.reply);
      setCurrChat("llmResponse", data.reply);   // ⭐ REQUIRED FIX
    }

    // 3️⃣ SAVE TO DATABASE
    await createChat({
      chatID,
      userID: user.id as string,
      imgName: inputImgName ?? undefined,
      userPrompt: prompt,
      llmResponse: data.reply,   // ⭐ REQUIRED FIX
    });

    // 4️⃣ RESET UI
    setMsgLoader(false);
    setInputImg(null);
    setInputImgName(null);
    setCurrChat("userPrompt", "");
  }, [
    currChat.userPrompt,
    chosenModel,
    chat,
    user
  ]);

  /* ======================================================
     IMAGE UPLOAD
  ====================================================== */
  const handleImageUpload = (e: any) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setInputImg(file);
    setInputImgName(file.name);
  };

  /* ======================================================
     ENTER KEY SUBMIT
  ====================================================== */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateMsg();
    }
  };

  /* ======================================================
     MODEL SELECTOR
  ====================================================== */
  const ModelSelector = () => (
    <div className="flex gap-2 overflow-x-auto py-2 mb-3">
      {MODELS.map((m) => (
        <button
          key={m.id}
          onClick={() => setChosenModel(m.id)}
          className={`px-4 py-1 border rounded-full text-sm transition
            ${
              chosenModel === m.id
                ? "bg-dahdouhPrimary text-white border-dahdouhPrimary"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">

      <ModelSelector />

      {/* IMAGE PREVIEW */}
      {inputImg && (
        <div className="da-image-preview">
          <MdImageSearch className="text-3xl" />
          <p className="text-sm font-semibold truncate">{inputImgName}</p>

          <IoMdClose
            className="da-image-close text-red-400 hover:text-red-600 transition"
            onClick={() => {
              setInputImg(null);
              setInputImgName(null);
            }}
          />
        </div>
      )}

      {/* LOVABLE INPUT BAR */}
      <div className="da-chatbox">

        {/* ATTACH BUTTON */}
        <label className="da-attach-btn cursor-pointer">
          +
          <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {/* TEXTAREA */}
        <textarea
          ref={textareaRef}
          placeholder="Ask Dahdouh AI anything..."
          value={currChat.userPrompt || ""}
          onChange={(e) => setCurrChat("userPrompt", e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="da-textarea"
        />

        {/* SEND BUTTON */}
        <button
          onClick={generateMsg}
          className="da-send-btn"
        >
          ➤
        </button>

      </div>
    </div>
  );
};

export default InputPrompt;