import {
	downloadJsonFromUrl,
	getAdobeAccessToken,
	getFileUploadData,
	pollExtractTextJob,
	queueExtractTextJob,
	uploadFileToAdobe,
} from "@/lib/pdfLoader";
import { chunkDocuments, combineDocuments, convertTextToDocument, formatDownloadJson } from "@/lib/utils";
import { createEmbeddingsAndStoreDocs } from "@/lib/vectorStore";
import { Pinecone } from "@pinecone-database/pinecone";

//server POST function to consume our pdf api in lib
//embeds and stores file to pinecone (the api)
//api endpoint to read and store file
export async function POST(request: Request) {
	//extract incoming blob (file hopefully) and namespace from form data
	const formData: FormData = await request.formData();
	const blobData = formData.get("file") as Blob; //file
	const namespace = formData.get("namespace") as string; //pinecone namespace

	//make consecutive api calls to various Adobe API endpoints to store, extract, and format text from pdf
	const token = await getAdobeAccessToken(process.env.ADOBE_CLIENT_ID!, process.env.ADOBE_CLIENT_SECRET_KEY!);
	console.log("Access Token:", token);

	const { uploadUri, assetID } = await getFileUploadData(token, process.env.ADOBE_CLIENT_ID!);
	console.log("Upload Uri", uploadUri, "assetID", assetID);

	await uploadFileToAdobe(uploadUri, blobData);
	console.log("file uploaded!");

	const pollUrl = await queueExtractTextJob(token, process.env.ADOBE_CLIENT_ID!, assetID);
	console.log(pollUrl);

	const downloadUri = await pollExtractTextJob(token, process.env.ADOBE_CLIENT_ID!, pollUrl);
	console.log(downloadUri);

	const json = await downloadJsonFromUrl(downloadUri);

	console.log(json);
	//convert json response to a Document
	const documents = convertTextToDocument(formatDownloadJson(json));
	console.log(documents);

	const chunkedDocs = await chunkDocuments(documents);
	await createEmbeddingsAndStoreDocs(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), chunkedDocs, namespace);
	console.log("upload done");

	return new Response("load, embed and upload successful", {
		headers: {
			"Content-Type": "application/json",
		},
		status: 200,
	});
}
