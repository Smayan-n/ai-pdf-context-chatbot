"use client";
import { getResponseToQuestion } from "@/lib/langchain";
import { Message, scrollChatToBottom } from "@/lib/utils";
import React, { Component, RefObject, useEffect, useRef, useState } from "react";
import "../styles/index.css";
import Form from "./Form";
import MessageCard from "./MessageCard";
import Spinner from "./Spinner";

function ChatInterface() {
	//array of all messages in the session
	const [messageHistory, setMessageHistory] = useState<Message[]>([]);
	//used to temporarily write data to ui until streaming is over
	const [streamedAns, setStreamedAns] = useState<string>("");
	//true when data is being streamed from server -
	const [dataStreaming, setDataStreaming] = useState(false);
	//to store whether the user is waiting for ai response or not
	const [loading, setLoading] = useState<boolean>(false);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	const onSubmit = async (question: string) => {
		console.log(question);
		const msg: Message = {
			role: "user",
			content: question,
		};
		setMessageHistory([...messageHistory, msg]);
	};

	useEffect(() => {
		//scroll to bottom
		scrollChatToBottom(chatContainerRef);
		//fetch answer from server only if the last message in history is from user (prevents infinite render loop)
		if (messageHistory.length !== 0 && getLastMessage().role === "user") {
			getAnswer();
		}
	}, [messageHistory]);

	const getLastMessage = (): Message => {
		return messageHistory[messageHistory.length - 1];
	};

	const getAnswer = async () => {
		//fetch answer from server
		setLoading(true);
		const userQuestion = getLastMessage().content;
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ question: userQuestion }),
		});
		setLoading(false);

		setDataStreaming(true);
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
				setDataStreaming(false);
				setStreamedAns("");
				//add full answer to message history
				const msg: Message = {
					role: "ai",
					content: runningSumText,
				};
				setMessageHistory([...messageHistory, msg]);
			};

			// Start reading and processing the stream
			readStream();
		}
	};

	return (
		<div className="rounded-2xl h-[85vh] flex flex-col justify-between p-5">
			<div className="main-chat-area bg-inherit scroll-m-4 h-[95%] flex p-6 flex-col overflow-auto mb-4">
				{messageHistory.map((msg, idx) => (
					<MessageCard role={msg.role} content={msg.content} key={idx} />
				))}
				{dataStreaming && <MessageCard role={"ai"} content={streamedAns} key={-1} />}
				<div ref={chatContainerRef}></div>
			</div>
			<Form loading={loading} placeholder={"Type to chat with AI..."} handleSubmit={onSubmit}></Form>
		</div>
	);
}

export default ChatInterface;
