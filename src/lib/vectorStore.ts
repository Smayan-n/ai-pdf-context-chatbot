import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";

/**returns embedded docs using Open AI's embed api */
export async function createEmbeddingsAndStoreDocs(splitDocs: Document<Record<string, any>>[]) {
	//openai embedding using ada-002 model

	const embeddings = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		openAIApiKey: process.env.OPENAI_API_KEY!,
	});

	//init pinecone client and index (database)
	const pinecone = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY!,
	});
	const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

	//store embedded docs in pinecone database
	await PineconeStore.fromDocuments(splitDocs, embeddings, {
		pineconeIndex: pineconeIndex,
		maxConcurrency: 5,
	});
}

export async function retrieveDocs() {
	//openai embedding using ada-002 model

	const embeddings = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		openAIApiKey: process.env.OPENAI_API_KEY!,
	});

	//init pinecone client and index (database)
	const pinecone = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY!,
	});
	const pineconeIndex = pinecone.index(process.env.INECONE_INDEX!);
}
