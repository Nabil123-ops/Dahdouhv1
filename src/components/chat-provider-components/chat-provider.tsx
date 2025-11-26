"use client";

import React from "react";
import Image from "next/image";
import root from "react-shadow/styled-components";
import geminiZustand from "@/utils/gemini-zustand";
import TextToSpeech from "./text-to-speech";
import ChatActionsBtns from "./chat-actions-btns";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/* ============================================================
   MODEL UI DETECTOR
============================================================ */
const detectModelUI = (model: string) => {
  if (model === "dahdouh-search") return "search";
  if (model === "dahdouh-agent") return "agent";
  if (model === "dahdouh-math") return "math";
  if (model === "dahdouh-vision") return "vision";
  if (model === "dahdouh-image") return "image"; // ⭐ Added image model
  return "default";
};

/* ============================================================
   SEARCH RESULTS UI
============================================================ */
const SearchResultCard = ({ text }: { text: string }) => {
  const blocks = text
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 fade-in-element">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="p-4 border rounded-xl bg-white/60 dark:bg-black/40 shadow-sm search-line"
        >
          <ReactMarkdown>{block}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   VISION RESULT UI
============================================================ */
const VisionCard = ({
  response,
  imgSrc,
}: {
  response: string;
  imgSrc?: string | null;
}) => {
  return (
    <div className="vision-box fade-in-element default-style">
      {imgSrc && (
        <div className="mb-4">
          <Image
            src={imgSrc}
            alt="Uploaded image"
            width={260}
            height={260}
            className="rounded-xl shadow-lg"
          />
        </div>
      )}

      <ReactMarkdown
        className="vision-text"
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};

/* ============================================================
   IMAGE GENERATION UI ⭐ NEW
============================================================ */
const ImageCard = ({ base64 }: { base64: string }) => {
  return (
    <div className="image-box fade-in-element">
      <p className="font-semibold text-lg mb-3">Generated Image</p>

      <img
        src={`data:image/png;base64,${base64}`}
        alt="Generated"
        className="rounded-xl shadow-lg w-full max-w-md"
      />

      <a
        href={`data:image/png;base64,${base64}`}
        download="dahdouh-image.png"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Download Image
      </a>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const ChatProvider = ({
  llmResponse,
  chatUniqueId,
  userPrompt,
  imgName,
  imgInfo,
}: {
  llmResponse: string;
  chatUniqueId: string;
  userPrompt: string;
  imgName?: string;
  imgInfo: { imgSrc: string; imgAlt: string };
}) => {
  const { chosenModel } = geminiZustand();

  const modelUI = detectModelUI(chosenModel);
  const cleanText = llmResponse.replace(/\*\*/g, "");

  return (
    <>
      {/* USER PROMPT */}
      <div className="flex items-start gap-3 mb-3 fade-in-element">
        <Image
          src={imgInfo.imgSrc}
          alt={imgInfo.imgAlt}
          width={38}
          height={38}
          className="rounded-full"
        />

        <div className="user-bubble">{userPrompt}</div>
      </div>

      {/* USER IMAGE PREVIEW */}
      {imgName && (
        <div className="img-preview fade-in-element">
          <p className="font-semibold">📷 {imgName}</p>
          <Image
            src={imgInfo.imgSrc}
            alt={imgName}
            width={240}
            height={240}
            className="rounded-xl mt-2"
          />
        </div>
      )}

      {/* TEXT TO SPEECH */}
      <div className="flex justify-end mt-3">
        <TextToSpeech handleTxtToSpeech={() => cleanText} />
      </div>

      {/* AI RESPONSE */}
      <div className="flex items-start gap-4 mt-6 fade-in-element">
        {/* DAHDOUH AI LOGO */}
        <Image
          src="/assets/logo.jpg"
          alt="Dahdouh AI"
          width={42}
          height={42}
          className="rounded-full shadow-md"
        />

        <root.div className="ai-wrapper fade-in-element">
          {/* SEARCH MODEL */}
          {modelUI === "search" && <SearchResultCard text={llmResponse} />}

          {/* VISION MODEL */}
          {modelUI === "vision" && (
            <VisionCard response={llmResponse} imgSrc={imgInfo.imgSrc} />
          )}

          {/* IMAGE MODEL ⭐ NEW */}
          {modelUI === "image" && (
            <ImageCard base64={llmResponse} />
          )}

          {/* DEFAULT / MATH / AGENT */}
          {modelUI !== "search" &&
            modelUI !== "vision" &&
            modelUI !== "image" && (
              <ReactMarkdown
                className={`ai-bubble ${
                  modelUI === "math"
                    ? "math-style"
                    : modelUI === "agent"
                    ? "agent-style"
                    : "default-style"
                }`}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {llmResponse}
              </ReactMarkdown>
            )}
        </root.div>
      </div>

      {/* ACTION BUTTONS */}
      <ChatActionsBtns
        chatID={chatUniqueId}
        userPrompt={userPrompt}
        llmResponse={llmResponse}
        shareMsg={`User: ${userPrompt}\n\nAI: ${cleanText}`}
      />
    </>
  );
};

export default ChatProvider;