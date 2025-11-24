"use client";

import geminiZustand from "@/utils/gemini-zustand";
import { FormatOutput } from "@/utils/shadow";
import Image from "next/image";
import React from "react";
import Markdown from "react-markdown";
import root from "react-shadow/styled-components";
import GradientLoader from "./gradient-loader";
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

      {/* =============== USER MESSAGE LOADING =============== */}
      <div className="w-full h-fit flex items-start gap-3">
        <Image
          src={image}          // User profile image
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

      {/* =============== IMAGE PREVIEW (IF EXISTS) =============== */}
      {inputImgName && (
        <div className="w-full mt-3 overflow-hidden">
          <div className="p-4 max-w-full w-fit bg-rtlLight dark:bg-rtlDark rounded-md flex items-start gap-2">
            <MdOutlineImage className="text-4xl" />
            <p className="text-lg truncate">{inputImgName}</p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end h-10 items-center" />

      {/* =============== AI LOADING + AI RESPONSE =============== */}
      <div id="new-chat" className="flex md:flex-row flex-col w-full items-start gap-4">

        {/* AI LOGO */}
        <Image
          src="/assets/logo.jpg"
          alt="Dahdouh AI"
          width={40}
          height={40}
          className="rounded-full animate-pulse"
        />

        {/* LOADER OR FINAL REPLY */}
        {!currChat.llmResponse ? (
          <GradientLoader />
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