export type Message = {
  userPrompt: string;
  llmResponse: string;
  imgName?: string;
};

export type SessionProps = {
  email: string;
  id: string;
  name: string;
  image: string;
};

/* ===========================================
   FIXED: Chat messages are FLAT (no "message" field)
=========================================== */
export type MessageProps = {
  _id: string;
  chatID: string;
  userID: string;
  userPrompt: string;
  llmResponse: string;
  imgName?: string;
  createdAt?: string;
  updatedAt?: string;
};

/* Chat Section */
export type ChatSectionProps = {
  data: {
    message?: MessageProps[];
  };
  image: string;
  name: string;
};