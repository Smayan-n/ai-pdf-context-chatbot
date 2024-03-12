import ChatInterface from "@/components/ChatInterface";
import SideBar from "@/components/SideBar";

/**Chat component */
export default function Chat(props: any) {
	const chatId = props.params.chatId;
	return (
		<>
			<SideBar></SideBar>
			<ChatInterface></ChatInterface>
			<div>{chatId}</div>
		</>
	);
}
