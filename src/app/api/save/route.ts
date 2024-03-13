//server POST function to access local store
export async function POST(request: Request) {
	const body = await request.json();
	const key = body.key ?? "null";
	const value = body.value ?? "null";

	let saved = true;
	try {
		//save to local store
		localStorage.setItem(key, value);
	} catch (e) {
		saved = false;
	}

	return new Response(JSON.stringify({ saved: saved }), {
		headers: {
			"Content-Type": "application/json",
		},
		status: 200,
	});
}
