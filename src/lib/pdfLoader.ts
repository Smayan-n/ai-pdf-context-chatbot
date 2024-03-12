import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { combineDocuments } from "./utils";

/**Given a path to a pdf, reads pdf and returns it back in chunks */
export async function getChunkedDocsFromPDF(path: string) {
	try {
		console.log("reached 0");

		const loader = new PDFLoader(path);
		const documents = await loader.load();

		console.log("reached 1");

		//chunk docs using Recursive text splitter
		//NOTE: experiment with these values and maybe add more properties?
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 500,
			chunkOverlap: 50,
		});
		console.log("reached 2");

		//split docs
		const splitDocs = await splitter.splitDocuments(documents);

		console.log("reached 3");

		return splitDocs;
	} catch (e) {
		console.error(e);
		throw new Error("Error loading and chunking pdf");
	}
}
