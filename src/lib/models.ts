//file that holds all openAi models (embeddings and chat models)

const OPENAI_API_KEY = "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";

const PINECONE_API_KEY = "fb2b6fd7-8e41-449c-a5c5-75abd1676827";
const PINECONE_INDEX = "ai-pdf-context-chatbot";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

export const embeddingsModel = new OpenAIEmbeddings({
	modelName: "text-embedding-ada-002",
	// openAIApiKey: process.env.OPENAI_API_KEY!,
	openAIApiKey: OPENAI_API_KEY,
});

export const chatModel = new ChatOpenAI({
	// openAIApiKey: process.env.OPENAI_API_KEY!,
	openAIApiKey: OPENAI_API_KEY,
});
