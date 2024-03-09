import { getResponseToQuestion } from "./langchain";
import { getChunkedDocsFromPDF } from "./pdfLoader";
import { createEmbeddingsAndStoreDocs } from "./vectorStore";

test();
async function test() {
	// const splitDocs = await getChunkedDocsFromPDF("./test.pdf");
	// console.log(splitDocs);

	// //store docs
	// await createEmbeddingsAndStoreDocs(splitDocs);
	// console.log("data stored successfully");

	// console.log(process.env.OPENAI_API_KEY);
	getResponseToQuestion();
}
