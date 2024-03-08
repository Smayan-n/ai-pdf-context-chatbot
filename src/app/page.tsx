import { getResp } from "@/lib/langchain";

export default async function Home() {
	const resp = await getResp();
	console.log(resp);
	return <div>Hello World {resp.toString()}</div>;
}
