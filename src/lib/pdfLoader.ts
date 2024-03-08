import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

/**Given a path to a pdf, reads pdf and returns it back in chunks */
export async function getChunkedDocsFromPDF(path: string) {
	try {
		const loader = new PDFLoader(path);
		const documents = await loader.load();

		//chunk docs using Recursive text splitter
		//NOTE: experiment with these values
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
