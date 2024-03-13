import { getChunkedDocsFromPDF } from "@/lib/pdfLoader";
import { createEmbeddingsAndStoreDocs } from "@/lib/vectorStore";
import { Pinecone } from "@pinecone-database/pinecone";

//server POST function to consume our pdf api in lib
//embeds and stores file to pinecone (the api)
export async function POST(request: Request) {
	//extract incoming blob (file hopefully) and namespace from formdata
	const formData: FormData = await request.formData();
	const blobData = formData.get("file") as Blob;
	const namespace = formData.get("namespace") as string;

	//make call to api we created in lib
	//read pdf file and get docs
	const docs = await getChunkedDocsFromPDF(blobData);
	console.log("pdf read");
	//store in pinecone
	await createEmbeddingsAndStoreDocs(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), docs, namespace);
	console.log("upload done");

	return new Response("load, embed and upload successful", {
		headers: {
			"Content-Type": "application/json",
		},
		status: 200,
	});
}
