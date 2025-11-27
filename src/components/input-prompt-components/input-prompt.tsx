"use client";

import React, { useCallback, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { User } from "next-auth";
import geminiZustand from "@/utils/gemini-zustand";
import { createChat } from "@/actions/actions";

// Icons
import { MdImageSearch } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaBrain, FaCalculator, FaSearch, FaRobot, FaVideo } from "react-icons/fa";

/* ======================================================
   MODEL LIST (FULL + VIDEO)
====================================================== */
const MODELS = [
  { label: "Dahdouh AI", id: "dahdouh-ai", icon: <FaBrain /> },
  { label: "Math", id: "dahdouh-math", icon: <FaCalculator /> },
  { label: "Search", id: "dahdouh-search", icon: <FaSearch /> },
  { label: "Agent", id: "dahdouh-agent", icon: <FaRobot /> },
  { label: "Vision", id: "dahdouh-vision", icon: <MdImageSearch /> },
  { label: "Image", id: "dahdouh-image", icon: <MdImageSearch /> },

  // ⭐ NEW VIDEO MODEL
  { label: "Video", id: "dahdouh-video", icon: <FaVideo /> },
];

/* ======================================================
   MODEL → REQUIRED PLAN
====================================================== */
const REQUIRED_PLAN: Record<string, "free" | "advanced" | "creator"> = {
  "dahdouh-ai": "free",
  "dahdouh-math": "free",
  "dahdouh-search": "advanced",
  "dahdouh-agent": "creator",
  "dahdouh-vision": "creator",
  "dahdouh-image": "creator",
  "dahdouh-video": "creator",
};

const PLAN_LEVEL = { free: 1, advanced: 2, creator: 3 };

function checkAccess(userPlan: string, required: string) {
  return PLAN_LEVEL[userPlan] >= PLAN_LEVEL[required];
}

/* ============================================================== */

const InputPrompt = ({ user }: { user?: User }) => {
  const router = useRouter();
  const { chat } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    currChat,
    inputImgName,
    setInputImgName,
    setCurrChat,
    setToast,
    setMsgLoader,
    setOptimisticResponse,
    setOptimisticPrompt,
    chosenModel,
    setChosenModel,
    userPlan, // ⭐ should be included in Zustand state
  } = geminiZustand();

  const [inputImg, setInputImg] = useState<File | null>(null);

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

    // ❌ Subscription check (client side)
    const required = REQUIRED_PLAN[chosenModel];
    if (!checkAccess(userPlan || "free", required)) {
      setToast("Upgrade your plan to use this feature.");
      router.push("/pricing");
      return;
    }

    try {
      setMsgLoader(true);

      const chatID = (chat as string) || nanoid();
      router.push(`/app/${chatID}`);
      setOptimisticPrompt(prompt);

      /* IMAGE BASE64 */
      let imgBase64 = null;
      if (inputImg) {
        const buffer = await inputImg.arrayBuffer();
        imgBase64 = `data:${inputImg.type};base64,${Buffer.from(buffer).toString(
          "base64"
        )}`;
      }

      /* SEND TO API */
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: chosenModel,
          imgBase64,
          email: user.email,
        }),
      });

      const data = await res.json();

      // API returned a subscription error
      if (data?.error && data?.error.includes("Upgrade")) {
        setToast(data.error);
        router.push("/pricing");
        setMsgLoader(false);
        return;
      }

      const reply = data?.reply || data?.error || "⚠ No response from AI.";
      setOptimisticResponse(reply);
      setCurrChat("llmResponse", reply);

      /* Save to DB */
      await createChat({
        chatID,
        userID: user.id as string,
        imgName: inputImgName ?? undefined,
        userPrompt: prompt,
        llmResponse: reply,
      });

      setMsgLoader(false);
      setInputImg(null);
      setInputImgName(null);
      setTimeout(() => setCurrChat("userPrompt", ""), 150);
    } catch (err) {
      console.error("AI Error:", err);
      setMsgLoader(false);
      setOptimisticResponse("❌ AI Request Failed.");
    }
  }, [
    currChat.userPrompt,
    user,
    chat,
    chosenModel,
    inputImg,
    userPlan,
    inputImgName,
    router,
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
      {MODELS.map((m) => {
        const required = REQUIRED_PLAN[m.id];
        const locked = !checkAccess(userPlan || "free", required);

        return (
          <button
            key={m.id}
            onClick={() => {
              if (locked) {
                setToast("Upgrade required for this model.");
                router.push("/pricing");
                return;
              }
              setChosenModel(m.id);
            }}
            className={`model-btn flex items-center gap-2 ${
              chosenModel === m.id ? "active" : ""
            } ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {m.icon}
            {m.label}
            {locked && <span className="text-xs text-red-400 ml-1">★</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <ModelSelector />

      {/* Image preview */}
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

      {/* Chatbox */}
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