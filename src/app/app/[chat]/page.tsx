import { auth } from "@/auth";
import { getChatHistory } from "@/actions/actions";
import { redirect } from "next/navigation";
import MsgLoader from "@/components/chat-provider-components/msg-loader";
import OptimisticChat from "@/components/chat-provider-components/optimistic-chat";

type PageProps = {
  params: {
    chat: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const session = await auth();

  if (!session || !session.user?.id) redirect("/app");

  const chatID = params.chat;

  const fetchedData = await getChatHistory({
    chatID,
    userID: session.user.id,
  });

  if (!fetchedData.success) redirect("/app");

  const messages = Array.isArray(fetchedData.message)
    ? fetchedData.message
    : [fetchedData.message];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-40">
      <OptimisticChat
        message={messages}
        name={session.user.name || ""}
        image={session.user.image || ""}
      />
      <MsgLoader
        name={session.user.name || ""}
        image={session.user.image || ""}
      />
    </div>
  );
};

export default Page;