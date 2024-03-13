import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { combineDocuments } from "./utils";

/**Given a path to a pdf, reads pdf and returns it back in chunks */
export async function getChunkedDocsFromPDF(pathOrBlob: string | Blob) {
	//do better error checking if you have time
	try {
		const loader = new PDFLoader(pathOrBlob);
		const documents = await loader.load();

		//chunk docs using Recursive text splitter
		//NOTE: experiment with these values and maybe add more properties?
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 500,
			chunkOverlap: 50,
		});

		//split docs
		const splitDocs = await splitter.splitDocuments(documents);

		return splitDocs;
	} catch (e) {
		console.error(e);
		throw new Error("Error loading and chunking pdf");
	}
}
