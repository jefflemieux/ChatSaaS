import ChatBot from "@/components/chatbot";
import { getConversationById } from "./actions/convDB";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {

	const { id } = await params;
	const conversation = await getConversationById(id);
	const messages = conversation.messages;

	return (
		<div>
			<ChatBot init_messages={messages} id={id} />
		</div>
	)
}