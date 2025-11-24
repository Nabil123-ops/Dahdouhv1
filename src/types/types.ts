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
   FLAT CHAT MESSAGE STRUCTURE (MongoDB model)
   chatID & userID MUST be optional because
   optimistic UI does not include them yet.
=========================================== */
export type MessageProps = {
  _id: string;
  chatID?: string;        // OPTIONAL
  userID?: string;        // OPTIONAL
  userPrompt: string;
  llmResponse: string;
  imgName?: string;
  createdAt?: string;
  updatedAt?: string;
};

/* ===========================================
   CHAT SECTION STRUCTURE
=========================================== */
export type ChatSectionProps = {
  data: {
    message?: MessageProps[];
  };
  image: string;
  name: string;
};