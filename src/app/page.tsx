import { redirect } from "next/navigation";

//redirect to "/chats" route
export default function Home() {
	return redirect("/chats");
}
