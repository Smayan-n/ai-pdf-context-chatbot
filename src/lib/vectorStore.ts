import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { embeddingsModel } from "./models";
import { combineDocuments } from "./utils";

/**stores embedded docs using Open AI's embeddings api to PineconeDB */
export async function createEmbeddingsAndStoreDocs(
	pineconeClient: Pinecone,
	splitDocs: Document<Record<string, any>>[],
	namespace: string
) {
	//init pinecone client and index (database)
	const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX!);

	//store embedded docs in pinecone database into specific namespace for each chat
	await PineconeStore.fromDocuments(splitDocs, embeddingsModel, {
		pineconeIndex: pineconeIndex,
		textKey: "text",
		namespace: namespace,
	});
}

/**returns Pinecone Vector Store object */
export async function retrieveVectorStore(pineconeClient: Pinecone, namespace: string) {
	//init pinecone index (database)
	const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX!);
	//get vectorStore with specific namespace - for different chats
	const vectorStore = await PineconeStore.fromExistingIndex(embeddingsModel, {
		pineconeIndex: pineconeIndex,
		textKey: "text",
		namespace: namespace,
	});
	return vectorStore;
}

export async function similaritySearch(pineconeClient: Pinecone, query: string, namespace: string) {
	//get vectorStore
	const vectorStore = await retrieveVectorStore(pineconeClient, namespace);

	const results = await vectorStore.similaritySearch(query);
	console.log(combineDocuments(results));
	return combineDocuments(results);
}

/**Dev function to clear pinecone index */
export async function deleteDocsInIndex(pineconeClient: Pinecone) {
	const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX!);
	await pineconeIndex.deleteAll();
}
