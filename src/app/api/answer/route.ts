import { getRelevantTextSegments, getResponseToQuestion } from "@/lib/langchain";
import { similaritySearch } from "@/lib/vectorStore";
import { Pinecone } from "@pinecone-database/pinecone";

//server POST function to consume our library
//api endpoint to answer question
export async function POST(request: Request) {
	const body = await request.json();
	const question = body.question ?? "no question";
	const namespace = body.namespace ?? "";
	const analyserMode = body.analyserMode ?? "";
	const conversationHistory = body.conversationHistory ?? "No conversation history";

	//make call to api we created in lib
	//different call based on mode requested
	let stream;
	console.log(analyserMode);
	if (analyserMode) {
		//ai feedback on similar documents
		stream = await getResponseToQuestion(question, conversationHistory, namespace);
	} else {
		//just similar documents
		stream = await getRelevantTextSegments(question, namespace);
	}
	// const stream = await similaritySearch(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), question, namespace);

	return new Response(stream, {
		headers: {
			"Content-Type": "application/octet-stream",
		},
		status: 200,
	});
}
