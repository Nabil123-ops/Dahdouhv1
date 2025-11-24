"use client";
import React, { useState, useCallback } from "react";
import DevButton from "../dev-components/dev-button";
import clsx from "clsx";
import Link from "next/link";
import { MdDeleteOutline, MdOutlineChatBubbleOutline } from "react-icons/md";
import { HiOutlineDotsVertical, HiOutlinePencil } from "react-icons/hi";
import DevPopover from "../dev-components/dev-popover";
import { BsPin } from "react-icons/bs";
import { useParams } from "next/navigation";
import DevModal from "../dev-components/dev-modal";
import { deleteChat } from "@/actions/actions";   // ✅ ONLY deleteChat exists
import DevEmojiPicker from "../dev-components/dev-emoji-picker";
import { TbMessageChatbot, TbPinned } from "react-icons/tb";
import geminiZustand from "@/utils/gemini-zustand";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

const SidebarChatList = ({ sidebarList }: any) => {
  const { chat } = useParams();
  const [settings, setSettings] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { setTopLoader, setToast } = geminiZustand();
  const router = useRouter();
  const [chatInfo, setChatInfo] = useState<{
    title: string | null;
    icon: string | null;
  }>({ title: null, icon: null });
  const [modalLoader, setModalLoader] = useState(false);
  const [modalContent, setModalContent] = useState<{
    content: string;
    title: string;
    chatID: string;
  }>({
    content: "",
    chatID: "",
    title: "",
  });

  const handleEmojiSelect = useCallback((emoji: string) => {
    setChatInfo((prev) => ({ ...prev, icon: emoji }));
  }, []);

  const handleDeleteChat = async (chatID: string) => {
    setModalLoader(true);
    try {
      await deleteChat(chatID);
      setModalOpen(false);
      setToast("Chat deleted successfully");
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setModalLoader(false);
    }
  };

  // ❗Removed handleRenameChat & handlePinChat because backend does not support it yet

  const renderModalContent = useCallback(() => {
    switch (modalContent.content) {
      case "delete":
        return (
          <div className="mt-5">
            <p>You will no longer see this chat here.</p>
            <div className="flex gap-3 justify-end !text-accentBlue mt-4">
              <DevButton
                size="sm"
                rounded="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </DevButton>
              <DevButton
                size="sm"
                rounded="sm"
                onClick={() => handleDeleteChat(modalContent.chatID)}
              >
                Delete
              </DevButton>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  }, [modalContent, chatInfo, handleEmojiSelect]);

  return (
    <>
      <ul className="mt-2 space-y-1">
        {sidebarList.success &&
          sidebarList.message.length > 0 &&
          sidebarList.message.map((item: any) => (
            <li key={item.chatID}>
              <DevButton
                rounded="full"
                variant="v3"
                onClick={() => setSettings(item.chatID)}
                className={clsx(
                  "text-sm overflow-hidden group !w-full justify-between relative !pr-2 gap-4",
                  item.chatID === chat && "!bg-accentBlue/50"
                )}
              >
                <Link
                  href={`/app/${item.chatID}`}
                  className="grid grid-cols-[auto_1fr] items-center w-full gap-4"
                >
                  {item?.chatInfo?.icon ? (
                    <i className="not-italic text-md scale-150">
                      {item?.chatInfo?.icon}
                    </i>
                  ) : (
                    <MdOutlineChatBubbleOutline className="text-lg" />
                  )}

                  {/* FIX: userPrompt moved out of item.message */}
                  <p className="truncate text-left">
                    {item?.chatInfo?.title || item.userPrompt}
                  </p>
                </Link>

                {/* ❗ pinChat removed so pin icon disabled */}
                {false && item?.isPinned && (
                  <TbPinned className="text-lg absolute top-3 right-2" />
                )}

                <DevPopover
                  place="right-start"
                  popButton={
                    <HiOutlineDotsVertical
                      className={clsx(
                        "cursor-auto aspect-square hover:bg-accentGray/30 rounded-full text-xl p-[2px]",
                        settings === item.chatID ? "block" : "hidden"
                      )}
                    />
                  }
                >
                  <div className="overflow-hidden py-2 min-w-44">
                    {/* REMOVE PIN UI */}
                    {/* REMOVE RENAME UI */}

                    <DevButton
                      onClick={() => {
                        setModalContent({
                          content: "delete",
                          chatID: item.chatID,
                          title: "Delete Chat?",
                        });
                        setModalOpen(true);
                      }}
                      variant="v3"
                      className="w-full !justify-start gap-3 group"
                      rounded="none"
                    >
                      <MdDeleteOutline className="text-xl" />
                      Delete
                    </DevButton>
                  </div>
                </DevPopover>
              </DevButton>
            </li>
          ))}
      </ul>

      <DevModal
        open={modalOpen}
        isOpen={setModalOpen}
        modalTitle={modalContent.title}
        loader={modalLoader}
        openBtn={<></>}
      >
        <div>{renderModalContent()}</div>
      </DevModal>
    </>
  );
};

export default SidebarChatList;