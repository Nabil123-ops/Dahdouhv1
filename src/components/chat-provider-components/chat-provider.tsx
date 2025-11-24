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
  return "default";
};

/* ============================================================
   SEARCH RESULTS
============================================================ */
const SearchResultCard = ({ text }: { text: string }) => {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  return (
    <div className="search-box fade-in-element">
      {lines.map((line, i) => (
        <p key={i} className="search-line">
          {line}
        </p>
      ))}
    </div>
  );
};

/* ============================================================
   VISION UI
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
            alt="Uploaded Image"
            width={260}
            height={260}
            className="rounded-xl shadow-md"
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
      {/* USER MESSAGE */}
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

      {/* USER IMAGE */}
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
      <div className="flex items-start gap-4 mt-6">
        {/* AI AVATAR */}
        <Image
          src="/assets/logo.jpg"
          alt="Dahdouh AI"
          width={42}
          height={42}
          className="rounded-full shadow-md"
        />

        {/* CONTENT AREA */}
        <root.div className="ai-wrapper fade-in-element">
          {/* SEARCH MODE */}
          {modelUI === "search" && (
            <SearchResultCard text={llmResponse} />
          )}

          {/* VISION MODE */}
          {modelUI === "vision" && (
            <VisionCard response={llmResponse} imgSrc={imgInfo.imgSrc} />
          )}

          {/* DEFAULT / MATH / AGENT */}
          {modelUI !== "search" && modelUI !== "vision" && (
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