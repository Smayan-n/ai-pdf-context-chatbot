import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PdfReader } from "pdfreader";
import { combineDocuments } from "./utils";

/**Given a path to a pdf or a File Blob, reads pdf and returns it back in chunks
 *
 * @param pathOrBlob file path or file as a Blob
 * @returns text from file split up into Documents
 */
export async function getChunkedDocsFromPDF(pathOrBlob: string | Blob) {
	//do better error checking if you have time
	try {
		const loader = new PDFLoader(pathOrBlob as Blob);
		const documents = await loader.load();
		console.log(documents);

		//chunk docs using Recursive text splitter
		//NOTE: experiment with these values and maybe add more properties?
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 150,
			chunkOverlap: 15,
		});

		//split docs
		const splitDocs = await splitter.splitDocuments(documents);

		return splitDocs;
	} catch (e) {
		console.error(e);
		throw new Error("Error loading and chunking pdf");
	}
}

/**Give, the client id and client secret, fetches an access token from Adobe's API */
export async function getAdobeAccessToken(clientId: string, clientSecret: string) {
	const response = await fetch("https://pdf-services.adobe.io/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
		}),
	});
	const data = await response.json();
	return data.access_token;
}

/**Given a token and clientId, returns a file upload uri and file asset id to use later */
export async function getFileUploadData(token: string, clientId: string) {
	const response1 = await fetch("https://pdf-services.adobe.io/assets", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"x-api-key": clientId,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			mediaType: "application/pdf",
		}),
	});
	const data = await response1.json();
	if (data && response1.status === 200) {
		return { uploadUri: data.uploadUri, assetID: data.assetID };
	} else {
		throw new Error();
	}
}

/**Given a upload url and file (Blob), accesses Adobe APi and uploads file */
export async function uploadFileToAdobe(uri: string, file: File | Blob) {
	await fetch(uri, {
		method: "PUT",
		headers: {
			"Content-Type": "application/pdf",
		},
		body: file,
	});
}

/**with the api token and client id, requests api to queue a text extraction job on our resource (file we uploaded earlier). Returns the poll job url */
export async function queueExtractTextJob(token: string, clientId: string, assetID: string) {
	const response = await fetch("https://pdf-services-ue1.adobe.io/operation/extractpdf", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"x-api-key": clientId,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			assetID: assetID,
			getCharBounds: false, // Set to true if you want bounding boxes for characters
			includeStyling: false, // Set to true if you want styling information
			elementsToExtract: ["text"], // Extract only text
		}),
	});
	if (response.ok) {
		//return poll job url
		return response.headers.get("Location") as string;
	} else {
		throw new Error();
	}
}

/**with the api token and client id, requests api to poll job in in given url. response is download url   */
export async function pollExtractTextJob(token: string, clientId: string, url: string) {
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"x-api-key": clientId,
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.status === "done") {
			return data.content.downloadUri;
		} else if (data.status === "in progress") {
			//poll api agin after 200 ms if job is not done
			await new Promise((resolve) => setTimeout(resolve, 200));
			return pollExtractTextJob(token, clientId, url);
		} else {
			//if job failed
			throw new Error("text extract job failed");
		}
	}
}
/**given a download url, extracts json from from fetch and returns it */
export async function downloadJsonFromUrl(url: string) {
	const response = await fetch(url);
	return response.json();
}
