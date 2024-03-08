import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StandaloneQuestionTemplate } from "./promptTemplates";

export async function getResp() {
	const prompt = PromptTemplate.fromTemplate(StandaloneQuestionTemplate);

	const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY! });
	const chain = prompt.pipe(llm);
	const response = await chain.invoke({
		question:
			"what is happening on mount Everest because I am young and don'f know much so I want to stay on top of the news and not live under a rock",
	});

	const standaloneQuestion = response.content;
	return standaloneQuestion;
	//get similar embeddings from pinecone
}
