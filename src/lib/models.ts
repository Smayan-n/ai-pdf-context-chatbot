//file that holds all openAi models (embeddings and chat models)

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

export const embeddingsModel = new OpenAIEmbeddings({
	modelName: "text-embedding-ada-002",
	// openAIApiKey: process.env.OPENAI_API_KEY!,
	openAIApiKey: process.env.OPENAI_API_KEY!,
});

export const chatModel = new ChatOpenAI({
	// openAIApiKey: process.env.OPENAI_API_KEY!,
	openAIApiKey: process.env.OPENAI_API_KEY!,
});
