import { PromptTemplate } from "@langchain/core/prompts";
import { Pinecone } from "@pinecone-database/pinecone";
import { RunnablePassthrough, RunnableSequence } from "langchain/runnables";
import { StringOutputParser } from "langchain/schema/output_parser";
import { chatModel } from "./models";
import { QuestionAnswerTemplate, StandaloneQuestionTemplate, similaritySearchTemplate } from "./promptTemplates";
import { combineDocuments } from "./utils";
import { retrieveVectorStore, similaritySearch } from "./vectorStore";

export async function getResponseToQuestion(question: string, conversationHistory: string, namespace: string) {
	const standaloneQuestionPrompt = PromptTemplate.fromTemplate(StandaloneQuestionTemplate);
	const answerPrompt = PromptTemplate.fromTemplate(QuestionAnswerTemplate);

	const vectorStore = await retrieveVectorStore(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), namespace);
	const vectorStoreRetriever = vectorStore.asRetriever({ searchType: "similarity" });

	//create three separate chains
	//chain that converts users question to a standalone question, and using the string parser, yields an answer string
	const standaloneQuestionChain = RunnableSequence.from([
		standaloneQuestionPrompt,
		chatModel,
		new StringOutputParser(),
	]); //string output parser parses output from llm to string so it can be piped into the vectorStore retriever

	//retriever chain that uses the standalone question generated from the previous chain to retrieve relevant docs from pinecone, and combining the individual docs into one string
	const retrieverChain = RunnableSequence.from([
		(prevResult) => prevResult.standaloneQuestion,
		vectorStoreRetriever,
		combineDocuments,
	]);

	//answer chain, uses the context of docs from the retriever chain along with the user question to answer the question as closely as possible
	const answerChain = RunnableSequence.from([answerPrompt, chatModel, new StringOutputParser()]);

	const chain = RunnableSequence.from([
		{
			standaloneQuestion: standaloneQuestionChain, //set output of standalone question chain to standaloneQuestion var so it can be used in next step
			originalInput: new RunnablePassthrough(), //pass through original input (question) as its needed in last step to answer question based on context
		},
		{
			context: retrieverChain, //set output of retriever chain to context so it can be used in next step
			question: ({ originalInput }) => originalInput.question, //question from original input (passed in chain.invoke)
			conversationHistory: ({ originalInput }) => originalInput.conversationHistory,
		},
		answerChain, //use context and question to to get answer
	]);
	// const response = await chain.invoke({
	// 	question: question,
	// });
	const stream = await chain.stream({
		question: question,
		conversationHistory: conversationHistory,
	});
	return stream;
}

/**
 * given a question and database namespace, will query database and perform a similarity search
 * on existing embeddings, returning closes matches
 *
 * @param query information to search for
 * @param namespace database namespace to look in for relevant information
 * @returns stream object with response
 */
export async function getRelevantTextSegments(query: string, namespace: string) {
	const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
	// const vectorStore = await retrieveVectorStore(pin, namespace);
	// const vectorStoreRetriever = vectorStore.asRetriever({ searchType: "similarity" });

	const informationPrompt = PromptTemplate.fromTemplate(similaritySearchTemplate);

	const chain = RunnableSequence.from([informationPrompt, chatModel, new StringOutputParser()]);

	const relevantInfo = await similaritySearch(pineconeClient, query, namespace);
	console.log(relevantInfo);

	const stream = await chain.stream({
		information: relevantInfo,
	});
	return stream;
}
