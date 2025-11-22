"use client";
import { create } from "zustand";
import { Message } from "../types/types";
import { User } from "next-auth";

interface GeminiState {
  msgLoader: boolean;
  setMsgLoader: (msgLoader: boolean) => void;
  setPrevChat: (newChat: Message) => void;
  prevChat: Message;
  topLoader: boolean;
  setTopLoader: (topLoader: boolean) => void;
  currChat: Message;
  setCurrChat: (name: string | null, value: string | null) => void;
  userData:User,
  setUserData:(userData:User)=>void,
  optimisticResponse:string | null,
  setOptimisticResponse:(optimisticResponse:string | null)=>void,
  setToast:(toast:string|null)=>void,
  devToast:string | null,
  inputImgName:string | null,
  setInputImgName:(inputImgName:string | null)=>void,
  optimisticPrompt:string | null,
  setOptimisticPrompt:(optimisticPrompt:string | null)=>void
  customPrompt:{prompt:string|null, placeholder:string|null},
  setCustomPrompt:(value:{prompt:string|null, placeholder:string|null})=>void
  geminiApiKey:string | null,
  setGeminiApiKey:(geminiApiKey:string | null)=>void
  
  // 💡 FIX 1: Add the chosenModel state property
  chosenModel: string;
  // 💡 FIX 2: Add the setChosenModel action
  setChosenModel: (modelId: string) => void;
}

const geminiZustand = create<GeminiState>()((set) => ({
  msgLoader: false,
  devToast:null,
  prevChat: { userPrompt: "", llmResponse: "" },
  topLoader: false,
  setToast:(value:string|null)=>set({devToast:value}),
  userData:{},
  optimisticResponse:null,
  optimisticPrompt:null,
  inputImgName:null,
  customPrompt:{prompt:null, placeholder:null},
  setCustomPrompt:(value:{prompt:string|null, placeholder:string|null})=>set({customPrompt:value}),
  setOptimisticPrompt:(value:string|null)=>set({optimisticPrompt:value}),
  setInputImgName:(value:string|null)=>set({inputImgName:value}),
  currChat: { userPrompt: "", llmResponse: "" },
  setTopLoader: (topLoader) => set({ topLoader }),
  setMsgLoader: (msgLoader) => set({ msgLoader }),
  setOptimisticResponse:(optimisticResponse:string | null)=>set({optimisticResponse}),
  setPrevChat: (newChat: Message) => set({ prevChat: newChat }),
  geminiApiKey:process.env.NEXT_PUBLIC_API_KEY as string,
  setGeminiApiKey:(geminiApiKey:string | null)=>set({geminiApiKey}),
  setCurrChat: (name: string | null, value: string | null) =>
    set((state) => ({
      currChat: { ...state.currChat, [name as string]: value },
    })),
    setUserData:(userData:User)=>set({userData}),
    
    // 💡 FIX 3: Initialize chosenModel with a default value
    chosenModel: "dahdouh-think", // Default model selected

    // 💡 FIX 4: Implement the setChosenModel action
    setChosenModel: (modelId: string) => set({ chosenModel: modelId }),
}));

export default geminiZustand;
