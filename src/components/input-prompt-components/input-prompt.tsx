"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { User } from "next-auth";

// Zustand
import geminiZustand from "@/utils/gemini-zustand";

// Actions
import { createChat } from "@/actions/actions";

// Icons
import { MdImageSearch } from "react-icons/md";
import { IoMdClose, IoMdSend } from "react-icons/io";


const MODELS = [
  { label: "Think", id: "dahdouh-think" },
  { label: "Deep", id: "dahdouh-deep" },
  { label: "Flash", id: "dahdouh-flash" },
  { label: "Boom", id: "dahdouh-boom" },
  { label: "Vision", id: "dahdouh-vision" }
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
    optimisticResponse,
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

    const chatID = (chat as string) ?? nanoid();
    router.push(`/app/${chatID}`);

    setMsgLoader(true);

    /* TEMPORARY PLACEHOLDER RESPONSE
       (Later we replace it with Groq/OpenAI models)
    */
    const reply = `🤖 Dahdouh AI (${chosenModel}) is not connected to backend yet.\n\nUser asked: ${prompt}`;

    setOptimisticResponse(reply);

    // Save in DB
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
     KEYBOARD ENTER
  ====================================================== */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateMsg();
    }
  };

  /* ======================================================
     UI — MODEL SELECTOR
  ====================================================== */
  const ModelSelector = () => (
    <div className="flex gap-2 overflow-x-auto py-1 mb-3">
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
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">

      <ModelSelector />

      {/* IMAGE PREVIEW */}
      {inputImg && (
        <div className="relative bg-white dark:bg-rtlDark p-3 rounded-xl border mb-3 flex items-center gap-3">
          <MdImageSearch className="text-3xl" />
          <p className="text-sm font-semibold truncate">{inputImgName}</p>

          <IoMdClose
            className="absolute right-2 top-2 text-xl cursor-pointer"
            onClick={() => {
              setInputImg(null);
              setInputImgName(null);
            }}
          />
        </div>
      )}

      {/* TEXT INPUT */}
      <div className="bg-rtlLight dark:bg-rtlDark border rounded-2xl p-2 flex items-center gap-2">

        <textarea
          ref={textareaRef}
          placeholder="Ask Dahdouh AI anything..."
          value={currChat.userPrompt || ""}
          onChange={(e) => setCurrChat("userPrompt", e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow outline-none bg-transparent resize-none p-2 text-lg"
        />

        <button
          onClick={generateMsg}
          className="bg-dahdouhPrimary text-white p-3 rounded-full"
        >
          <IoMdSend className="text-xl" />
        </button>
      </div>

      {/* UPLOAD IMAGE */}
      <div className="mt-3">
        <input type="file" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default InputPrompt;