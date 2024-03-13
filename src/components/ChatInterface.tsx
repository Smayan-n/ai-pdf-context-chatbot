"use client";
import { getResponseToQuestion } from "@/lib/langchain";
import { Chat, Message, formatMessagesIntoConvHistory, scrollChatToBottom } from "@/lib/utils";
import React, { Component, RefObject, useEffect, useRef, useState } from "react";
import "../styles/index.css";
import Form from "./Form";
import MessageCard from "./MessageCard";
import Spinner from "./Spinner";

interface ChatInterfaceProps {
	currentChat: Chat | undefined;
}

function ChatInterface(props: ChatInterfaceProps) {
	const { currentChat } = props;

	//chat (name and id)
	//array of all messages in the session
	const [messages, setMessages] = useState<Message[]>([]);
	//used to temporarily write data to ui until streaming is over
	const [streamedAns, setStreamedAns] = useState<string>("");
	//to store whether the user is waiting for ai response or not
	const [loading, setLoading] = useState<boolean>(false);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	const onSubmit = async (question: string) => {
		console.log(question);
		const msg: Message = {
			role: "user",
			content: question,
		};
		setMessages([...messages, msg]);
	};

	//fetch chat from localstore
	useEffect(() => {
		const msgs = localStorage.getItem(`chat-msgs-${currentChat?.chatId}`);
		if (msgs !== "undefined") {
			const parsed = JSON.parse(msgs as string);
			if (parsed) {
				// console.log("loading", parsed, chatId);
				// console.log(parsed.messages);
				setMessages(parsed.messages as Message[]);
			}
		}
	}, [currentChat]);

	//store back in local store
	useEffect(() => {
		if (messages.length !== 0) {
			const str = JSON.stringify(messages);
			// console.log("storing", str, chatId);
			localStorage.setItem(`chat-msgs-${currentChat?.chatId}`, str);
		}
	}, [messages, currentChat]);

	useEffect(() => {
		//scroll to bottom
		scrollChatToBottom(chatContainerRef);
		//fetch answer from server only if the last message in history is from user (prevents infinite render loop)
		if (messages.length !== 0 && getLastMessage().role === "user") {
			getAnswer();
		}
	}, [messages]);

	const getLastMessage = (): Message => {
		return messages[messages.length - 1];
	};

	const getAnswer = async () => {
		//fetch answer from server
		setLoading(true);
		const userQuestion = getLastMessage().content;
		const response = await fetch("/api/answer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				question: userQuestion,
				conversationHistory: formatMessagesIntoConvHistory(messages),
			}),
		});
		setLoading(false);

		//make sure body exists and getReader is a valid function
		if (response.body && typeof response.body.getReader === "function") {
			const reader = response.body.getReader();

			// Create a TextDecoder to decode the binary data to a string
			const decoder = new TextDecoder();

			// Define a function to continuously read and process chunks of data
			let runningSumText = "";
			const readStream = async () => {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					// Decode the chunk of data to a string using TextDecoder
					const chunk = decoder.decode(value, { stream: true });

					// keep running answer
					runningSumText += chunk;
					// Update state with as streamed data comes in to get that typing effect
					setStreamedAns(runningSumText);
				}
				setStreamedAns("");
				//add full answer to message history
				const msg: Message = {
					role: "ai",
					content: runningSumText,
				};
				setMessages([...messages, msg]);
			};

			// Start reading and processing the stream
			readStream();
		}
	};

	return (
		<div className="rounded-2xl h-full flex flex-col justify-between p-8">
			<div className="main-chat-area bg-inherit scroll-m-4 h-full flex p-6 flex-col overflow-auto mb-4">
				{messages.length !== 0 ? (
					messages.map((msg, idx) => <MessageCard role={msg.role} content={msg.content} key={idx} />)
				) : (
					<div className="flex items-center justify-center">
						<div className="text-2xl">
							Hello! I&apos;m a helpful PDF-analyzing bot! How can I help you today?
						</div>
					</div>
				)}
				{streamedAns.length !== 0 && <MessageCard role={"ai"} content={streamedAns} key={-1} />}
				<div ref={chatContainerRef}></div>
			</div>
			<Form loading={loading} placeholder={"Chat with AI..."} handleSubmit={onSubmit}></Form>
		</div>
	);
}

export default ChatInterface;
