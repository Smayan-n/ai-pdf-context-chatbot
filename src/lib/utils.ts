import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export type Message = { role: "user" | "ai"; content: string; respType?: "similarity" | "analyser" };

export type Chat = { chatId: string; chatName: string; new: boolean };

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

export function scrollChatToBottom(containerRef: React.RefObject<HTMLElement>, smooth?: boolean) {
	if (containerRef.current) {
		const div = containerRef.current;
		div.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
	}
}

/**returns random string of characters */
export function generateRandomId() {
	//Math.random() and converts it to a base-36 string (using characters 0-9 and a-z) using toString(36).
	return Math.random().toString(36).slice(2);
}

/** returns a string that can be used as a pinecone namespace based on the chat name and id */
export function getNamespaceFromChat(chat: Chat): string {
	return chat.chatId;
}

export function formatDownloadJson(json: any) {
	const elements: Array<any> = json.elements;
	console.log(elements);
	let text = "";
	//seperate with spaces
	for (const elem of elements) {
		text += elem.Text + "\n";
	}

	return text;
}

/**converts a string to a Document type which can be more easily used by langchain and pinecone to embed and store */
export function convertTextToDocument(text: string): Document<Record<string, any>>[] {
	const arr: Document<Record<string, any>>[] = [];

	arr.push(new Document({ pageContent: text, metadata: { source: "blob" } }));
	return arr;
}

//**Chunks and splits up documents into smaller pieces using recursive splitting */
export async function chunkDocuments(docs: Document<Record<string, any>>[]) {
	//chunk docs using Recursive text splitter
	//NOTE: experiment with these values and maybe add more properties?
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 300,
		chunkOverlap: 60,
	});

	//split docs
	const splitDocs = await splitter.splitDocuments(docs);
	return splitDocs;
}
