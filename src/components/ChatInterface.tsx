"use client";
import { getResponseToQuestion } from "@/lib/langchain";
import { Chat, Message, formatMessagesIntoConvHistory, getNamespaceFromChat, scrollChatToBottom } from "@/lib/utils";
import React, { ChangeEvent, Component, RefObject, useEffect, useRef, useState } from "react";
import "../styles/index.css";
import Form from "./Form";
import MessageCard from "./MessageCard";
import Spinner from "./Spinner";

interface ChatInterfaceProps {
	currentChat: Chat | undefined;
	fileName: string;
}

function ChatInterface(props: ChatInterfaceProps) {
	const { currentChat, fileName } = props;

	const dummyRef = useRef<HTMLDivElement>(null);

	//chat (name and id)
	//array of all messages in the session
	const [messages, setMessages] = useState<Message[]>([]);
	//used to temporarily write data to ui until streaming is over
	const [streamedAns, setStreamedAns] = useState<string>("");
	//to store whether the user is waiting for ai response or not
	const [loading, setLoading] = useState<boolean>(false);
	const [analyserChecked, setAnalyserChecked] = useState(false);
	//quality of life features
	const [atChatBottom, setAtChatBottom] = useState(true);

	const handleScroll = (evt: any) => {
		//check if chat container is at bottom or not
		const elem: HTMLDivElement = evt.target;
		const currHeight = elem.scrollTop + elem.clientHeight;
		const totalHeight = elem.scrollHeight;
		if (totalHeight - currHeight > 50) {
			setAtChatBottom(false);
		} else {
			setAtChatBottom(true);
		}
	};

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
		if (msgs !== "undefined" && msgs !== null) {
			const parsed = JSON.parse(msgs as string);
			if (parsed) {
				// console.log("loading", parsed, chatId);
				// console.log(parsed.messages);
				setMessages(parsed as Message[]);
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
	}, [messages]);

	useEffect(() => {
		scrollChatToBottom(dummyRef, true);
		//fetch answer from server only if the last message in history is from user (prevents infinite render loop)
		if (messages.length !== 0 && getLastMessage().role === "user") {
			getAnswer();
		}
	}, [messages]);

	//scroll to bottom when chat first loads
	useEffect(() => {
		scrollChatToBottom(dummyRef, true);
	}, []);

	useEffect(() => {
		//scroll to bottom when new answer is being streamed
		scrollChatToBottom(dummyRef);
	}, [streamedAns]);

	const getLastMessage = (): Message => {
		return messages[messages.length - 1];
	};

	//function to use answer api endpoint and get response to user question
	const getAnswer = async () => {
		if (!currentChat) {
			return;
		}

		//fetch answer from API Endpoint on server
		setLoading(true);
		const userQuestion = getLastMessage().content;
		const response = await fetch("/api/answer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				question: userQuestion,
				namespace: getNamespaceFromChat(currentChat),
				conversationHistory: formatMessagesIntoConvHistory(messages),
				analyserMode: analyserChecked,
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
					//format text before updating state
					setStreamedAns(runningSumText);
				}
				setStreamedAns("");
				//add full answer to message history
				const msg: Message = {
					role: "ai",
					content: runningSumText,
					respType: analyserChecked ? "analyser" : "similarity",
				};
				setMessages([...messages, msg]);
			};

			// Start reading and processing the stream
			readStream();
		}
	};

	return (
		<div className="rounded-2xl h-full flex flex-col justify-between p-8 min-w-52">
			<div className="mb-4">
				<label className="inline-flex items-center cursor-pointer">
					<input
						onChange={() => setAnalyserChecked(!analyserChecked)}
						type="checkbox"
						value="on"
						className="sr-only peer"
					/>
					<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
					<span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Analyser Mode</span>
				</label>
			</div>
			<div
				onScroll={handleScroll}
				className="relative main-chat-area bg-inherit scroll-m-4 h-full flex p-6 flex-col overflow-auto mb-4"
			>
				{messages?.length !== 0 ? (
					messages?.map((msg, idx) => <MessageCard msg={msg} key={idx} />)
				) : (
					<div className="flex items-center justify-center">
						<div className="text-lg">
							Hello! I&apos;m a helpful PDF-analyzing bot! How can I help you analyze the PDF File?
						</div>
					</div>
				)}
				{streamedAns.length !== 0 && (
					<MessageCard
						msg={{
							content: streamedAns,
							role: "ai",
							respType: analyserChecked ? "analyser" : "similarity",
						}}
						key={-1}
					/>
				)}
				<div ref={dummyRef}></div>
			</div>
			{!atChatBottom && (
				<button
					onClick={() => scrollChatToBottom(dummyRef, true)}
					className="bg-gray-800 cursor-pointer absolute rounded-full bg-clip-padding border text-token-text-secondary border-token-border-light right-1/2 bg-token-main-surface-primary bottom-28"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="m-1 text-token-text-primary">
						<path
							d="M17 13L12 18L7 13M12 6L12 17"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
				// <div onClick={() => scrollChatToBottom(dummyRef, true)} className="scroll-down-btn">
				// 	Scroll
				// </div>
			)}
			<Form
				loading={loading}
				placeholder={analyserChecked ? "Chat with AI..." : "PDF Search Query..."}
				handleSubmit={onSubmit}
			></Form>
		</div>
	);
}

export default ChatInterface;
