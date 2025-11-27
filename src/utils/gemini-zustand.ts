"use client";
import { create } from "zustand";
import { Message } from "../types/types";
import { User } from "next-auth";

interface GeminiState {
  msgLoader: boolean;
  setMsgLoader: (msgLoader: boolean) => void;

  prevChat: Message;
  setPrevChat: (newChat: Message) => void;

  currChat: Message;
  setCurrChat: (name: string, value: string) => void;

  topLoader: boolean;
  setTopLoader: (value: boolean) => void;

  userData: User | null;
  setUserData: (u: User) => void;

  optimisticResponse: string | null;
  setOptimisticResponse: (v: string | null) => void;

  optimisticPrompt: string | null;
  setOptimisticPrompt: (v: string | null) => void;

  devToast: string | null;
  setToast: (v: string | null) => void;

  inputImgName: string | null;
  setInputImgName: (v: string | null) => void;

  customPrompt: { prompt: string | null; placeholder: string | null };
  setCustomPrompt: (v: { prompt: string | null; placeholder: string | null }) => void;

  chosenModel: string;
  setChosenModel: (modelId: string) => void;

  groqApiKey: string;
  setGroqApiKey: (key: string) => void;

  userPlan: "free" | "advanced" | "creator";
  setUserPlan: (plan: "free" | "advanced" | "creator") => void;

  subscriptionExpires: Date | null;
  setSubscriptionExpires: (date: Date | null) => void;

  guestMessages: number;
  setGuestMessages: (n: number) => void;
}

const geminiZustand = create<GeminiState>()((set) => ({
  /* LOADING */
  msgLoader: false,
  setMsgLoader: (msgLoader) => set({ msgLoader }),

  topLoader: false,
  setTopLoader: (value) => set({ topLoader: value }),

  /* CHAT STATES */
  prevChat: { userPrompt: "", llmResponse: "" },
  setPrevChat: (newChat) => set({ prevChat: newChat }),

  currChat: { userPrompt: "", llmResponse: "" },
  setCurrChat: (name, value) =>
    set((state) => ({ currChat: { ...state.currChat, [name]: value } })),

  /* USER DATA */
  userData: null,
  setUserData: (user) => set({ userData: user }),

  /* OPTIMISTIC UI */
  optimisticResponse: null,
  setOptimisticResponse: (v) => set({ optimisticResponse: v }),

  optimisticPrompt: null,
  setOptimisticPrompt: (v) => set({ optimisticPrompt: v }),

  /* TOAST (this was missing in your version!) */
  devToast: null,
  setToast: (v) => set({ devToast: v }),

  /* IMAGE NAME */
  inputImgName: null,
  setInputImgName: (v) => set({ inputImgName: v }),

  /* CUSTOM PROMPT */
  customPrompt: { prompt: null, placeholder: null },
  setCustomPrompt: (v) => set({ customPrompt: v }),

  /* MODEL STATE */
  chosenModel: "dahdouh-ai",
  setChosenModel: (modelId) => set({ chosenModel: modelId }),

  /* API KEY */
  groqApiKey: "",
  setGroqApiKey: (key) => set({ groqApiKey: key }),

  /* SUBSCRIPTION SYSTEM */
  userPlan: "free",
  setUserPlan: (plan) => set({ userPlan: plan }),

  subscriptionExpires: null,
  setSubscriptionExpires: (date) => set({ subscriptionExpires: date }),

  /* GUEST FREE MESSAGE LIMIT */
  guestMessages: 0,
  setGuestMessages: (n) => set({ guestMessages: n }),
}));

export default geminiZustand;