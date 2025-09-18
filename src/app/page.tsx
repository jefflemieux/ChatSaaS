import ChatBot from "@/components/chatbot";
import { generateId } from "ai";

export default function Home() {
  return (
    <div>
      <ChatBot id={generateId()} init_messages={[]} />
    </div>
  );
}
