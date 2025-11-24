"use client";

import geminiZustand from "@/utils/gemini-zustand";
import { FormatOutput } from "@/utils/shadow";
import Image from "next/image";
import React from "react";
import Markdown from "react-markdown";
import root from "react-shadow/styled-components";
import { MdOutlineImage } from "react-icons/md";

const MsgLoader = ({
  name,
  image,
}: {
  name: string;
  image: string;
}) => {
  const { currChat, msgLoader, inputImgName } = geminiZustand();

  if (!msgLoader) return null;

  return (
    <div key="loader" className="my-16 mt-10 fade-in-element">

      {/* ================= USER PROMPT ================= */}
      <div className="w-full h-fit flex items-start gap-3">
        <Image
          src={image}   
          alt={name}
          width={38}
          height={38}
          className="rounded-full"
        />

        <textarea
          className="prompt-area pt-1 max-h-40 text-base resize-none bg-transparent outline-none rounded-md px-1 w-full"
          readOnly
          value={currChat.userPrompt}
        />
      </div>

      {/* ================= IMAGE PREVIEW ================= */}
      {inputImgName && (
        <div className="w-full mt-3 overflow-hidden">
          <div className="p-4 max-w-full w-fit bg-rtlLight dark:bg-rtlDark rounded-md flex items-start gap-2">
            <MdOutlineImage className="text-4xl" />
            <p className="text-lg truncate">{inputImgName}</p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end h-10 items-center" />

      {/* ================= AI LOADING ================= */}
      <div className="flex items-start gap-4 w-full">

        {/* AI LOGO + SPINNING RING */}
        <div className="dahdouh-logo-wrapper">
          <Image
            src="/assets/logo.jpg"
            alt="Dahdouh AI"
            width={40}
            height={40}
            className="dahdouh-logo"
          />

          {/* This is the ring around the logo */}
          <div className="dahdouh-spin-circle"></div>
        </div>

        {/* LOADER OR FINAL AI RESPONSE */}
        {!currChat.llmResponse ? (
          <div className="flex items-center">
            <div className="typing-dots">
              <div></div><div></div><div></div>
            </div>
          </div>
        ) : (
          <root.div className="w-full shadowDiv -translate-y-4">
            <FormatOutput>
              <Markdown>{currChat.llmResponse}</Markdown>
            </FormatOutput>
          </root.div>
        )}
      </div>
    </div>
  );
};

export default MsgLoader;