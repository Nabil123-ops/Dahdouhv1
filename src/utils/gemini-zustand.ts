"use client";
import { create } from "zustand";
import { Message } from "../types/types";
import { User } from "next-auth";

type PlanType = "free" | "advanced" | "creator";

interface GeminiState {
  /* ========================================
     LOADING + TOAST
  ======================================== */
  msgLoader: boolean;
  setMsgLoader: (msgLoader: boolean) => void;

  topLoader: boolean;
  setTopLoader: (value: boolean) => void;

  devToast: string | null;
  setToast: (v: string | null) => void;

  /* ========================================
     CHAT STATE
  ======================================== */
  prevChat: Message;
  setPrevChat: (newChat: Message) => void;

  currChat: Message;
  setCurrChat: (name: string, value: string) => void;

  optimisticResponse: string | null;
  setOptimisticResponse: (v: string | null) => void;

  optimisticPrompt: string | null;
  setOptimisticPrompt: (v: string | null) => void;

  inputImgName: string | null;
  setInputImgName: (v: string | null) => void;

  customPrompt: { prompt: string | null; placeholder: string | null };
  setCustomPrompt: (v: { prompt: string | null; placeholder: string | null }) => void;

  /* ========================================
     USER DATA + AUTH
  ======================================== */
  userData: User | null;
  setUserData: (u: User | null) => void;

  /* ========================================
     SUBSCRIPTION STATE
  ======================================== */
  userPlan: PlanType;                      // "free" | "advanced" | "creator"
  setUserPlan: (plan: PlanType) => void;

  subscriptionExpires: Date | null;
  setSubscriptionExpires: (date: Date | null) => void;

  /* ========================================
     GUEST FREE TRIAL
  ======================================== */
  guestMessages: number;                   // number of free messages used
  setGuestMessages: (n: number) => void;

  /* ========================================
     AI MODEL SELECTION
  ======================================== */
  chosenModel: string;
  setChosenModel: (modelId: string) => void;

  /* ========================================
     GROQ API Key
  ======================================== */
  groqApiKey: string;
  setGroqApiKey: (key: string) => void;
}

const geminiZustand = create<GeminiState>()((set) => ({
  /* ========================================
     LOADING STATES
  ======================================== */
  msgLoader: false,
  setMsgLoader: (msgLoader) => set({ msgLoader }),

  topLoader: false,
  setTopLoader: (value) => set({ topLoader: value }),

  /* ========================================
     CHAT STATE
  ======================================== */
  prevChat: { userPrompt: "", llmResponse: "" },
  setPrevChat: (newChat) => set({ prevChat: newChat }),

  currChat: { userPrompt: "", llmResponse: "" },
  setCurrChat: (name, value) =>
    set((state) => ({
      currChat: { ...state.currChat, [name]: value },
    })),

  optimisticResponse: null,
  setOptimisticResponse: (v) => set({ optimisticResponse: v }),

  optimisticPrompt: null,
  setOptimisticPrompt: (v) => set({ optimisticPrompt: v }),

  inputImgName: null,
  setInputImgName: (v) => set({ inputImgName: v }),

  customPrompt: { prompt: null, placeholder: null },
  setCustomPrompt: (v) => set({ customPrompt: v }),

  /* ========================================
     USER DATA
  ======================================== */
  userData: null,
  setUserData: (user) => set({ userData: user }),

  /* ========================================
     SUBSCRIPTIONS
  ======================================== */
  userPlan: "free",
  setUserPlan: (plan) => set({ userPlan: plan }),

  subscriptionExpires: null,
  setSubscriptionExpires: (date) => set({ subscriptionExpires: date }),

  /* ========================================
     FREE TRIAL
  ======================================== */
  guestMessages: 0,
  setGuestMessages: (n) => set({ guestMessages: n }),

  /* ========================================
     MODELS
  ======================================== */
  chosenModel: "dahdouh-ai",
  setChosenModel: (modelId) => set({ chosenModel: modelId }),

  /* ========================================
     API KEY
  ======================================== */
  groqApiKey: "",
  setGroqApiKey: (key) => set({ groqApiKey: key }),
}));

export default geminiZustand;