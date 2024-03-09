import { Document } from "langchain/document";

export type Message = { role: "user" | "ai"; content: string };

/** extract all documents's page contents and join into paragraphs*/
export function combineDocuments(docs: Document<Record<string, any>>[]) {
	return docs.map((doc) => doc.pageContent).join("\n\n");
}

export function scrollChatToBottom(containerRef: React.RefObject<HTMLElement>) {
	if (containerRef.current) {
		const lastMsg = containerRef.current.lastElementChild;
		if (lastMsg) {
			lastMsg.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}
}
