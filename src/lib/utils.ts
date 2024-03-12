import { Document } from "langchain/document";

export type Message = { role: "user" | "ai"; content: string };

export type Chat = { messages?: Message[]; chatId: string; chatName: string };

/** extract all documents's page contents and join into paragraphs*/
export function combineDocuments(docs: Document<Record<string, any>>[]) {
	return docs.map((doc) => doc.pageContent).join("\n\n");
}

/**takes in an array of messages and converts them into a single string as conversation history between the AI and user */
export function formatMessagesIntoConvHistory(msgs: Message[]): string {
	//join elements by separating by new line
	if (msgs.length === 0) {
		return "No previous conversation history";
	}

	return msgs
		.map((msg) => {
			if (msg.role === "ai") {
				return "AI: " + msg.content;
			} else {
				return "Human: " + msg.content;
			}
		})
		.join("\n");
}

export function scrollChatToBottom(containerRef: React.RefObject<HTMLElement>) {
	if (containerRef.current) {
		const lastMsg = containerRef.current.lastElementChild;
		if (lastMsg) {
			lastMsg.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}
}

/**returns random string of characters */
export function generateRandomId() {
	//Math.random() and converts it to a base-36 string (using characters 0-9 and a-z) using toString(36).
	return Math.random().toString(36).slice(2);
}
