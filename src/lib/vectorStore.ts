import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { embeddingsModel } from "./models";

/**stores embedded docs using Open AI's embeddings api to PineconeDB */
export async function createEmbeddingsAndStoreDocs(
	pineconeClient: Pinecone,
	splitDocs: Document<Record<string, any>>[]
) {
	//init pinecone client and index (database)
	const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX!);

	//store embedded docs in pinecone database
	await PineconeStore.fromDocuments(splitDocs, embeddingsModel, {
		pineconeIndex: pineconeIndex,
		maxConcurrency: 5,
		// textKey: "text",
	});
}

/**returns Pinecone Vector Store object */
export async function retrieveVectorStore(pineconeClient: Pinecone) {
	//init pinecone index (database)
	const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX!);
	//get vectorStore
	const vectorStore = await PineconeStore.fromExistingIndex(embeddingsModel, { pineconeIndex: pineconeIndex });
	return vectorStore;
}
