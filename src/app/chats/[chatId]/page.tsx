import App from "@/components/App";
import ChatInterface from "@/components/ChatInterface";
import Layout from "@/components/Layout";
import SideBar from "@/components/SideBar";
import "../../../styles/index.css";

/**Chat component */
export default function Chat(props: any) {
	const chatId = props.params.chatId;
	console.log(chatId);
	return (
		<>
			<App chatId={chatId}></App>
			{/* <SideBar></SideBar>
			<ChatInterface chatName={"hello"} chatId={chatId}></ChatInterface> */}
		</>
	);
}
