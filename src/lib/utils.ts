import { Document } from "langchain/document";

/** extract all documents's page contents and join into paragraphs*/
export function combineDocuments(docs: Document<Record<string, any>>[]) {
	return docs.map((doc) => doc.pageContent).join("\n\n");
}
