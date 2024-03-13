"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SideBarItem(props: {
	title: string;
	id: string;
	onSetChatName?: ((name: string) => void) | undefined;
	selected?: boolean;
}) {
	const { title, id, onSetChatName, selected } = props;
	const router = useRouter();

	const [chatName, setChatName] = useState("");
	//if onSetChatName is not undefined, input part of componenent is active
	//other list stuff is conditionally rendered
	return (
		<li>
			<a
				onClick={() => {
					if (onSetChatName === undefined) {
						router.push("/chats/" + id);
					}
				}}
				className={
					"flex items-center p-2 text-white rounded-lg group " +
					(onSetChatName === undefined ? " hover:bg-gray-700 hover:opacity-95" : "") +
					(selected ? " bg-slate-700" : "")
				}
			>
				{/* <svg
					className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
					<path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
					<path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
				</svg> */}

				{onSetChatName === undefined ? (
					<span className="ms-3">{title}</span>
				) : (
					<form
						action="submit"
						onSubmit={(evt) => {
							evt.preventDefault();
							onSetChatName(chatName);
						}}
					>
						<input
							placeholder="name"
							onChange={(evt) => setChatName(evt.target.value)}
							className="break-words h-10 scrollbar-hidden q-textarea border border-gray-400 focus:border-gray-200 rounded-lg w-full resize-none bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4 flex-grow"
						></input>
					</form>
				)}
			</a>
		</li>
	);
}

export default SideBarItem;
