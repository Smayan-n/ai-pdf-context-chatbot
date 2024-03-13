"use client";
import { Chat, Message, formatMessagesIntoConvHistory, generateRandomId } from "@/lib/utils";
import { useEffect, useState } from "react";
import ChatInterface from "./ChatInterface";
import SideBar from "./SideBar";

//Main application component that will keep track of all state
interface AppProps {
	chatId: string;
}

function App(props: AppProps) {
	const { chatId } = props;

	const [chatList, setChatList] = useState<Chat[]>([]);
	//currently selected chat if any
	const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined);

	//load chatlist
	useEffect(() => {
		//get chats from local store and update state
		const chats = localStorage.getItem("chat-list");
		if (chats !== "undefined") {
			console.log("loaded", chats);
			setChatList(JSON.parse(chats!));
		}
	}, []);

	useEffect(() => {
		//update local store
		if (chatList.length !== 0) {
			console.log("saved", chatList);
			localStorage.setItem("chat-list", JSON.stringify(chatList));
		}
		//and also set current chat with id passed in as prop
		const curr = chatList.find((chat) => chat.chatId === chatId);
		setCurrentChat(curr);
	}, [chatList, chatId]);

	const handleNewChatCreate = (name: string) => {
		//add new chat to list
		const chat: Chat = { chatName: name, chatId: generateRandomId() };
		if (chatList) {
			setChatList([...chatList, chat]);
		} else {
			setChatList([chat]);
		}
	};

	return (
		<>
			<SideBar onNewChatCreate={handleNewChatCreate} chatList={chatList} currentChat={currentChat}></SideBar>
			<ChatInterface currentChat={currentChat}></ChatInterface>
		</>
	);
}

export default App;
