import { getResponseToQuestion } from "@/lib/langchain";

//server POST function to consume our api in lib
export async function POST(request: Request) {
	const body = await request.json();
	const question = body.question ?? "no question";
	const conversationHistory = body.conversationHistory ?? "No conversation history";

	//make call to api we created in lib
	//stream
	const answer = await getResponseToQuestion(question, conversationHistory);

	// return answer;
	// return new Response(JSON.stringify({ answer: answer }), {
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	status: 200,
	// });
	return new Response(answer, {
		headers: {
			"Content-Type": "application/octet-stream",
		},
		status: 200,
	});
}
