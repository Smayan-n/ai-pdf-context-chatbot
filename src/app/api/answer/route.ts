import { getResponseToQuestion } from "@/lib/langchain";

//server POST function to consume our api in lib
export async function POST(request: Request) {
	const body = await request.json();
	const question = body.question ?? "no question";
	const namespace = body.namespace ?? "";
	const conversationHistory = body.conversationHistory ?? "No conversation history";

	//make call to api we created in lib
	//stream
	const stream = await getResponseToQuestion(question, conversationHistory, namespace);
	return new Response(stream, {
		headers: {
			"Content-Type": "application/octet-stream",
		},
		status: 200,
	});
}
