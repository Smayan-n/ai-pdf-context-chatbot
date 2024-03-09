import { ChangeEvent, useState } from "react";
import "../styles/index.css";
import Spinner from "./Spinner";

// import { cn } from "@/lib/utils";
export default function From(props: {
	placeholder: string;
	handleSubmit: (question: string) => void;
	loading: boolean;
}) {
	const { placeholder, handleSubmit, loading } = props;
	const [question, setQuestion] = useState("");

	const onQuestionChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
		setQuestion(evt.target.value);

		const textarea = evt.target;
		//auto expand
		textarea.style.height = "";
		textarea.style.height = textarea.scrollHeight + "px";

		//scroll bar only shows up if there are mor ethan 8 lines in input
		const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
		const lines = textarea.scrollHeight / lineHeight;
		if (lines > 8) {
			textarea.classList.remove("scrollbar-hidden");
			textarea.classList.add("scrollbar-visible");
		} else {
			textarea.classList.add("scrollbar-hidden");
			textarea.classList.remove("scrollbar-visible");
		}
	};

	return (
		<form
			onSubmit={(evt) => {
				evt.preventDefault();
				handleSubmit(question);
				//reset input
				setQuestion("");
			}}
		>
			<label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
				Search
			</label>
			<div className="relative">
				<div className="flex flex-row items-end justify-end gap-1">
					<textarea
						rows={1}
						placeholder={placeholder}
						className="break-words h-14 scrollbar-hidden q-textarea border border-gray-400 focus:border-gray-200 rounded-lg w-full resize-none bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4 flex-grow"
						value={question}
						onChange={(evt) => onQuestionChange(evt)}
					></textarea>
					{!loading ? (
						<button
							type="submit"
							className="w-36 h-14 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
						>
							Ask AI
						</button>
					) : (
						<div className="flex justify-center items-center w-36 h-14 text-white bg-green-700 opacity-95 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">
							<Spinner />
						</div>
					)}
				</div>
			</div>
		</form>
	);
}
