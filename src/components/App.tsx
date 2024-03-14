"use client";
import { Chat, Message, formatMessagesIntoConvHistory, generateRandomId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInterface from "./ChatInterface";
import FileInput from "./FileInput";
import SideBar from "./SideBar";
import Spinner from "./Spinner";

//load initial chats for deliverables
const initialChats: Chat[] = [
	{ chatId: "459ldfbstbg", chatName: "Global Warming", new: false },
	{ chatId: "thngcunmbwk", chatName: "German Law", new: false },
];

//Main application component that will keep track of all state
interface AppProps {
	chatId: string;
}

function App(props: AppProps) {
	const { chatId } = props;

	const [chatList, setChatList] = useState<Chat[]>(chatId === "no-chat-open" ? initialChats : []);
	//currently selected chat if any
	const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined);
	//for display purposes only
	const [fileName, setFileName] = useState<string>("");

	//load chatlist
	useEffect(() => {
		//get chats from local store and update state
		const chats = localStorage.getItem("chat-list");
		// console.log(chats === "undefined");
		if (chats !== "undefined" && chats !== null) {
			setChatList(JSON.parse(chats!));
		}
	}, []);

	useEffect(() => {
		//update local store
		if (chatList.length !== 0) {
			console.log(chatList);
			localStorage.setItem("chat-list", JSON.stringify(chatList));
		}
		//and also set current chat with id passed in as prop
		const curr = chatList.find((chat) => chat.chatId === chatId);
		setCurrentChat(curr);
	}, [chatList, chatId]);

	const handleNewChatCreate = (name: string) => {
		//add new chat to list
		const chat: Chat = { chatName: name, chatId: generateRandomId(), new: true };
		if (chatList) {
			setChatList([...chatList, chat]);
		} else {
			setChatList([chat]);
		}
	};

	//called when a pdf file for a new chat is uploaded to pinecone successfully
	const handleFileUploaded = (chatFor: Chat, fileName: string) => {
		//change 'new' property of chatFor in list to false so chatInterface can be rendered
		const copyList = chatList.slice(0);
		const changedList = copyList.map((chat) => {
			if (chat.chatId === chatFor.chatId) {
				return { ...chat, new: false };
			} else {
				return chat;
			}
		});
		setChatList(changedList);
		setFileName(fileName);
	};

	//render different components based on passed in chatId
	//if chatId = 'no-chat-open' don't display chatInterface
	return (
		<>
			<SideBar onNewChatCreate={handleNewChatCreate} chatList={chatList} currentChat={currentChat}></SideBar>
			<div className="h-[100vh]">
				{chatId === "no-chat-open" ? (
					<div className="text-2xl flex items-center justify-center h-screen p-10">
						No chat open! Please select a chat or create a new one
					</div>
				) : currentChat === undefined ? (
					<div className="flex h-[100%] justify-center items-center flex-col gap-2">
						<Spinner />
						<span>Loading...</span>
					</div>
				) : currentChat?.new || currentChat === undefined ? (
					<FileInput currentChat={currentChat} onFileUploaded={handleFileUploaded} />
				) : (
					<ChatInterface currentChat={currentChat} fileName={fileName}></ChatInterface>
				)}
				{}
			</div>
		</>
	);
}

export default App;
