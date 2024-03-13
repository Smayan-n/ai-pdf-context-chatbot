//server GET request to access local storage
export async function POST(request: Request) {
	const body = await request.json();
	const key = body.key ?? "null";

	const value = localStorage.getItem(key);
	console.log(value);

	return new Response(JSON.stringify({ value: value ?? undefined }), {
		headers: {
			"Content-Type": "application/json",
		},
		status: 200,
	});
}
