import App from "@/components/App";
import ChatInterface from "@/components/ChatInterface";
import SideBar from "@/components/SideBar";
import SideBarItem from "@/components/SideBarItem";
import { getResponseToQuestion } from "@/lib/langchain";
import { getChunkedDocsFromPDF } from "@/lib/pdfLoader";
import { createEmbeddingsAndStoreDocs, deleteDocsInIndex } from "@/lib/vectorStore";
import { Pinecone } from "@pinecone-database/pinecone";
import "../../styles/index.css";

export default async function ChatsHome() {
	//load new pdf
	// await deleteDocsInIndex(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }));
	// const docs = await getChunkedDocsFromPDF("./cse5.pdf");
	// // // //embed and save to pinecone
	// await createEmbeddingsAndStoreDocs(new Pinecone({ apiKey: process.env.PINECONE_API_KEY! }), docs);
	// // // const resp = await getResponseToQuestion("jawndfgbwofnamdfkelrgje", "");
	// console.log("done");

	return (
		// <>
		// 	{/* <SideBar></SideBar> */}
		// 	<div className="h-[100vh] ml-64">No Chat Open!</div>
		// </>
		<>
			<App chatId="no-chat-open"></App>
		</>
	);
}
