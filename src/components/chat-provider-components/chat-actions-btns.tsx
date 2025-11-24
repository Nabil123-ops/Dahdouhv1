"use client";

import React, { useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import DevButton from "../dev-components/dev-button";
import ReactTooltip from "../dev-components/react-tooltip";
import ModifyResponse from "./modify-response";
import ShareChat from "./share-chat";
import { FiMoreVertical } from "react-icons/fi";
import DevPopover from "../dev-components/dev-popover";
import { MdContentCopy, MdOutlineFlag } from "react-icons/md";
import geminiZustand from "@/utils/gemini-zustand";
import { IoMdSearch } from "react-icons/io";

const ChatActionsBtns = ({
  chatID,
  llmResponse,
  userPrompt,
  shareMsg,
}: {
  chatID: string;
  llmResponse: string;
  userPrompt: string;
  shareMsg: string;
}) => {

  const { devToast, setToast } = geminiZustand();

  const [googleRes, setGoogleRes] = useState<string[] | null>(null);
  const [loader, setLoader] = useState(false);

  /* ======================================================
     COPY CHAT
  ====================================================== */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareMsg);
      setToast("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  /* ======================================================
     DOUBLE-CHECK — RUNS ON SERVER (SAFE)
  ====================================================== */
  const handleDoubleCheck = async () => {
    const prompt = `
Generate a list of at least 5 different Google search queries based strictly on the user's message.
Only return a PURE JSON array of strings. No explanation.

User message:
${userPrompt}
    `;

    try {
      setLoader(true);

      // Call your server Gemini endpoint
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: "dahdouh-flash", // use fast model
        }),
      });

      const data = await res.json();

      if (!data.reply) return;

      // Clean JSON triple ticks
      const cleaned = data.reply
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      setGoogleRes(parsed);

    } catch (err) {
      console.error("Double-check error:", err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="w-full flex items-center gap-2 !text-2xl mt-2">

        {/* LIKE / DISLIKE */}
        {[
          { icon: BiLike, tipdata: "Good job" },
          { icon: BiDislike, tipdata: "Bad job" },
        ].map((item, index) => (
          <ReactTooltip key={index} tipData={item.tipdata}>
            <DevButton
              asIcon
              rounded="full"
              size="lg"
              variant="v2"
              className="opacity-80"
            >
              <item.icon />
            </DevButton>
          </ReactTooltip>
        ))}

        {/* MODIFY RESPONSE */}
        <ModifyResponse chatUniqueId={chatID} llmResponse={llmResponse} />

        {/* SHARE */}
        <ShareChat shareMsg={shareMsg} />

        {/* DOUBLE CHECK */}
        <ReactTooltip tipData="Double-check response">
          <DevButton
            asIcon
            rounded="full"
            onClick={handleDoubleCheck}
            size="lg"
            variant="v2"
            className="opacity-80"
          >
            {loader ? (
              <span className="modal-loader"></span>
            ) : (
              <IoMdSearch className="text-blue-600" />
            )}
          </DevButton>
        </ReactTooltip>

        {/* MORE OPTIONS */}
        <DevPopover
          place="top-start"
          popButton={
            <ReactTooltip tipData="more">
              <DevButton
                asIcon
                rounded="full"
                size="lg"
                variant="v2"
                className="opacity-80"
              >
                <FiMoreVertical />
              </DevButton>
            </ReactTooltip>
          }
        >
          <div className="w-52 py-2">

            {/* COPY */}
            <DevButton
              onClick={copyToClipboard}
              variant="v3"
              className="w-full !justify-start gap-3 group"
              rounded="none"
            >
              <MdContentCopy className="text-xl" /> Copy
            </DevButton>

            {/* REPORT */}
            <DevButton
              variant="v3"
              className="w-full !justify-start gap-3 group"
              rounded="none"
            >
              <MdOutlineFlag className="text-xl" /> Report legal issue
            </DevButton>

          </div>
        </DevPopover>
      </div>

      {/* GOOGLE SEARCH RESULTS */}
      {googleRes && googleRes.length > 0 && (
        <div className="w-full md:w-[90%] mt-5 mx-auto overflow-hidden p-5 rounded-2xl space-y-3 bg-accentGray/10">
          <h3>Search related topics</h3>

          <div className="space-y-1">
            {googleRes.map((item, i) => (
              <DevButton
                key={i}
                target="_blank"
                variant="v2"
                href={`https://www.google.com/search?q=${item}`}
                className="text-accentBlue/80 w-full !justify-start text-left flex items-center gap-2 hover:!bg-accentBlue/15"
              >
                <IoMdSearch className="text-xl" />
                <p className="truncate">{item}</p>
              </DevButton>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatActionsBtns;