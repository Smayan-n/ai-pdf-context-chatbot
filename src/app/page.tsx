import { getResp } from "@/lib/langchain";
import { getChunkedDocsFromPDF } from "@/lib/pdfLoader";
import { createEmbeddingsAndStoreDocs } from "@/lib/vectorStore";
import { Pinecone } from "@pinecone-database/pinecone";

export default async function Home() {
	//load new pdf
	// const docs = await getChunkedDocsFromPDF("./global-warming.pdf");
	// //embed and save to pinecone
	// await createEmbeddingsAndStoreDocs(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), docs);
	// console.log("done");
	const resp = await getResp();
	// console.log(resp);

	return <div>Hello World {"".toString()}</div>;
}
