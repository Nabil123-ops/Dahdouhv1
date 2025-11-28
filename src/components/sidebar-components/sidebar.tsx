"use client";

import React, { useState } from "react";
import DevButton from "../dev-components/dev-button";
import { FiMenu } from "react-icons/fi";
import { IoMdAdd, IoMdHelpCircleOutline } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import ReactTooltip from "../dev-components/react-tooltip";
import { GoDotFill } from "react-icons/go";
import DevPopover from "../dev-components/dev-popover";
import ThemeSwitch from "./theme-switch";
import { useParams, useRouter } from "next/navigation";
import { User } from "next-auth";
import SidebarChatList from "./sidebar-chat-list";
import { createPortal } from "react-dom";
import Image from "next/image";
import { LuGalleryHorizontalEnd } from "react-icons/lu";
import { FaCrown } from "react-icons/fa";

const SideBar = ({ user, sidebarList }: { user?: User; sidebarList: any }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { chat } = useParams();

  return (
    <section
  className={`h-full md:flex-shrink-0 bg-rtlLight md:transform-none transition-[width]
    ${open 
      ? "w-[300px] opacity-100 pointer-events-auto" 
      : "w-0 opacity-0 pointer-events-none md:pointer-events-auto md:w-[70px] md:opacity-100"
    }
    fixed inset-0 dark:bg-rtlDark p-3 flex flex-col justify-between z-10 md:relative md:z-0`}
>
      {/* ===== FIXED PORTAL SAFELY (Prevents 500 errors) ===== */}
      {typeof window !== "undefined" &&
        createPortal(
          <div className="fixed z-[1000] top-3 left-3 flex items-center gap-3">
            {/* Toggle Button */}
            <ReactTooltip place="bottom-start" tipData="Toggle Sidebar">
              <DevButton
                onClick={() => setOpen(!open)}
                asIcon
                size="xl"
                rounded="full"
                variant="v3"
              >
                <FiMenu className="text-xl" />
              </DevButton>
            </ReactTooltip>

            {/* Dahdouh AI Logo on Mobile */}
            <div className="block md:hidden">
              <Image
                src="/assets/logo.jpg"
                width={40}
                height={40}
                alt="Dahdouh AI"
                className="rounded-md"
              />
            </div>

            {/* New Chat Button - Mobile Only */}
            {chat && (
              <DevButton
                size="lg"
                href="/app"
                className="!text-xl fixed md:hidden top-3 right-32 z-50"
                rounded="full"
                variant="v1"
                asIcon
              >
                <IoMdAdd />
              </DevButton>
            )}
          </div>,
          document.body
        )}

      {/* Header Section */}
      <div className="mt-14">
        <ReactTooltip place="bottom" tipData="New chat">
          <DevButton
            onClick={() => router.push(`/app`)}
            rounded="full"
            asIcon={open ? false : true}
            variant="v1"
            className="mt-5 text-sm gap-3 px-[13px] justify-between md:!flex !hidden"
          >
            <IoMdAdd className="text-xl" /> {open && "New chat"}
          </DevButton>
        </ReactTooltip>

        {open && (
          <h2 className="pl-3 mt-10">
            {sidebarList.success && sidebarList.message.length > 0 && "Recent"}
          </h2>
        )}
      </div>

      {/* Chat list */}
      <div className={`${open ? "block" : "hidden"} flex-grow overflow-y-auto`}>
        <SidebarChatList sidebarList={sidebarList} />
      </div>

      {/* Footer Section */}
      <div>
        <ul className="mt-5 space-y-1">
          {/* Help */}
          <li>
            <ReactTooltip place="right" tipData="Help">
              <DevButton
                variant="v3"
                className={`text-sm *:text-xl ${
                  open ? "aspect-auto" : "aspect-square"
                } group !w-full !justify-start gap-3`}
                rounded="full"
              >
                <IoMdHelpCircleOutline />
                {open && "Help"}
              </DevButton>
            </ReactTooltip>
          </li>

          {/* Activity */}
          <li>
            <ReactTooltip place="right" tipData="Chat Activity">
              <DevButton
                variant="v3"
                className={`text-sm *:text-xl ${
                  open ? "aspect-auto" : "aspect-square"
                } group !w-full !justify-start gap-3`}
                rounded="full"
              >
                <RxCounterClockwiseClock />
                {open && "Activity"}
              </DevButton>
            </ReactTooltip>
          </li>

          {/* Settings */}
          <li>
            <ReactTooltip place="right" tipData="Settings">
              <DevPopover
                contentClick={false}
                place="top-end"
                popButton={
                  <DevButton
                    variant="v3"
                    className={`text-sm *:text-xl ${
                      open ? "aspect-auto" : "aspect-square"
                    } group !w-full !justify-start gap-3`}
                    rounded="full"
                  >
                    <IoSettingsOutline />
                    {open && "Settings"}
                  </DevButton>
                }
              >
                <div className="w-52 py-2">
                  <DevButton
                    variant="v3"
                    href="/app/prompt-gallery"
                    className="w-full !justify-start gap-3 group"
                    rounded="none"
                  >
                    <LuGalleryHorizontalEnd className="text-xl" />
                    Prompt gallery
                  </DevButton>

                  <DevButton
                    variant="v3"
                    className="w-full !justify-start gap-3 group"
                    rounded="none"
                  >
                    <label
                      htmlFor="toggleBox"
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <MdOutlineDarkMode className="text-xl" />
                      Dark theme
                      <ThemeSwitch />
                    </label>
                  </DevButton>
                </div>
              </DevPopover>
            </ReactTooltip>
          </li>
        </ul>

        {/* Upgrade Button - Mobile */}
        <DevButton
          variant="v1"
          className="gap-2 mt-3 text-sm md:!hidden !flex"
          onClick={() => router.push("/pricing")}
        >
          <FaCrown className="text-lg text-yellow-400" />
          Upgrade to Dahdouh Pro
        </DevButton>

        {/* Bottom branding */}
        {open && (
          <div>
            <span className="flex items-center text-xs gap-2 ml-3 mt-5">
              <GoDotFill />
              <p>Location: https://dahdouhai.live</p>
            </span>
            <p className="text-xs ml-3 mt-1 text-gray-400">
              © 2025 Dahdouh AI • All Rights Reserved
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SideBar;