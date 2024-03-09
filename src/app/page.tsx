import ChatInterface from "@/components/ChatInterface";
import { getResponseToQuestion } from "@/lib/langchain";
import { getChunkedDocsFromPDF } from "@/lib/pdfLoader";
import { createEmbeddingsAndStoreDocs } from "@/lib/vectorStore";

export default async function Home() {
	//load new pdf
	// const docs = await getChunkedDocsFromPDF("./global-warming.pdf");
	// //embed and save to pinecone
	// await createEmbeddingsAndStoreDocs(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), docs);
	// console.log("done");
	// const resp = await getResponseToQuestion("hello what is better: cars or bikes?");
	// console.log(resp);

	return (
		<>
			<ChatInterface></ChatInterface>
		</>
	);
}
