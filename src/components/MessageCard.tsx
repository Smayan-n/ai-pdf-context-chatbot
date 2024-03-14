import { Message } from "@/lib/utils";
import React, { Component } from "react";

function MessageCard(props: { msg: Message }) {
	const { msg } = props;

	//splits up text into paragraphs so it can be viewed more easily
	const processText = (text: string) => {
		return text.split("__POINT__").map((paragraph, index) => (
			<>
				<p key={index}>{paragraph}</p>
				<br />
			</>
		));
	};

	return (
		<div className="w-[100%] p-6 bg-inherit shadow">
			<div>
				<h4 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{msg.role === "ai" ? "AI" : "You"}{" "}
					<div className="text-sm text-gray-400">
						{msg.role === "ai" &&
							(msg.respType === "similarity" ? "(similarity Search)" : "(analyser content)")}
					</div>
				</h4>
			</div>
			<p className="mb-3 font-normal text-gray-300">{processText(msg.content)}</p>
		</div>
	);
}

export default MessageCard;
