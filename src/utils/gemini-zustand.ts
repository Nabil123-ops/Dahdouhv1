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

  // ⭐ MODEL STATE
  chosenModel: string;
  setChosenModel: (modelId: string) => void;

  // ⭐ GROQ API KEY STATE
  groqApiKey: string;
  setGroqApiKey: (key: string) => void;

  // ⭐ NEW: USER PLAN STATE
  userPlan: "free" | "advanced" | "creator";
  setUserPlan: (plan: "free" | "advanced" | "creator") => void;

  // ⭐ NEW: SUBSCRIPTION EXPIRATION
  subscriptionExpires: Date | null;
  setSubscriptionExpires: (date: Date | null) => void;
}

const geminiZustand = create<GeminiState>()((set) => ({
  msgLoader: false,
  setMsgLoader: (msgLoader) => set({ msgLoader }),

  topLoader: false,
  setTopLoader: (value) => set({ topLoader: value }),

  prevChat: { userPrompt: "", llmResponse: "" },
  setPrevChat: (newChat) => set({ prevChat: newChat }),

  currChat: { userPrompt: "", llmResponse: "" },
  setCurrChat: (name: string, value: string) =>
    set((state) => ({
      currChat: { ...state.currChat, [name]: value },
    })),

  userData: null,
  setUserData: (user) => set({ userData: user }),

  optimisticResponse: null,
  setOptimisticResponse: (v) => set({ optimisticResponse: v }),

  optimisticPrompt: null,
  setOptimisticPrompt: (v) => set({ optimisticPrompt: v }),

  devToast: null,
  setToast: (v) => set({ devToast: v }),

  inputImgName: null,
  setInputImgName: (v) => set({ inputImgName: v }),

  customPrompt: { prompt: null, placeholder: null },
  setCustomPrompt: (v) => set({ customPrompt: v }),

  // ⭐ Default model
  chosenModel: "dahdouh-ai",
  setChosenModel: (modelId: string) => set({ chosenModel: modelId }),

  // ⭐ GROQ API KEY STATE
  groqApiKey: "",
  setGroqApiKey: (key: string) => set({ groqApiKey: key }),

  // ⭐ NEW: USER PLAN (DEFAULT = FREE)
  userPlan: "free",
  setUserPlan: (plan) => set({ userPlan: plan }),

  // ⭐ NEW: SUBSCRIPTION EXPIRATION
  subscriptionExpires: null,
  setSubscriptionExpires: (date) => set({ subscriptionExpires: date }),
}));

export default geminiZustand;