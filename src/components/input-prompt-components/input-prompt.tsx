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

// Model icons
import { FaBrain, FaCalculator, FaSearch, FaRobot } from "react-icons/fa";

/* ======================================================
   Dahdouh AI MODELS
====================================================== */
const MODELS = [
  { label: "Dahdouh AI", id: "dahdouh-ai", icon: <FaBrain /> },
  { label: "Math", id: "dahdouh-math", icon: <FaCalculator /> },
  { label: "Search", id: "dahdouh-search", icon: <FaSearch /> },
  { label: "Agent", id: "dahdouh-agent", icon: <FaRobot /> },
  { label: "Vision", id: "dahdouh-vision", icon: <MdImageSearch /> },
];

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
    setOptimisticPrompt,
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

    try {
      setMsgLoader(true);

      const chatID = (chat as string) || nanoid();
      router.push(`/app/${chatID}`);

      setOptimisticPrompt(prompt);

      /* Convert image to Base64 for Vision model */
      let imgBase64 = null;

      if (inputImg) {
        const buffer = await inputImg.arrayBuffer();
        imgBase64 = `data:${inputImg.type};base64,${Buffer.from(buffer).toString(
          "base64"
        )}`;
      }

      /* SEND TO API */
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: chosenModel,
          imgBase64,
        }),
      });

      const data = await response.json();

      const reply =
        data?.reply ||
        data?.error ||
        data?.results ||
        "⚠ No response from AI.";

      setOptimisticResponse(reply);

      /* SAVE TO DATABASE */
      await createChat({
        chatID,
        userID: user.id as string,
        imgName: inputImgName ?? undefined,
        userPrompt: prompt,
        llmResponse: typeof reply === "string" ? reply : JSON.stringify(reply),
      });

      setMsgLoader(false);
      setInputImg(null);
      setInputImgName(null);

      setTimeout(() => setCurrChat("userPrompt", ""), 200);
    } catch (err) {
      console.error(err);
      setMsgLoader(false);
      setOptimisticResponse("❌ AI Request Failed.");
    }
  }, [currChat.userPrompt, user, chat, chosenModel]);

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
     ENTER TO SEND
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
    <div className="flex gap-2 overflow-x-auto py-2 mb-3 model-select-row">
      {MODELS.map((m) => (
        <button
          key={m.id}
          onClick={() => setChosenModel(m.id)}
          className={`model-btn flex items-center gap-2 ${
            chosenModel === m.id ? "active" : ""
          } ${m.id}`}
        >
          {m.icon}
          {m.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <ModelSelector />

      {inputImg && (
        <div className="da-image-preview">
          <MdImageSearch className="text-3xl" />
          <p className="text-sm font-semibold truncate">{inputImgName}</p>

          <IoMdClose
            className="da-image-close text-red-400 hover:text-red-600"
            onClick={() => {
              setInputImg(null);
              setInputImgName(null);
            }}
          />
        </div>
      )}

      <div className="da-chatbox">
        <label className="da-attach-btn cursor-pointer">
          +
          <input type="file" onChange={handleImageUpload} className="hidden" />
        </label>

        <textarea
          ref={textareaRef}
          placeholder="Ask Dahdouh AI anything…"
          value={currChat.userPrompt || ""}
          onChange={(e) => setCurrChat("userPrompt", e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="da-textarea"
        />

        <button onClick={generateMsg} className="da-send-btn">
          ➤
        </button>
      </div>
    </div>
  );
};

export default InputPrompt;