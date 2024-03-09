import React, { Component } from "react";

function MessageCard(props: { role: string; content: string }) {
	const { role, content } = props;
	return (
		<div className="w-[100%] p-6 bg-inherit shadow">
			<div>
				<h4 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{role === "ai" ? "AI" : "You"}
				</h4>
			</div>
			<p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{content}</p>
		</div>
	);
}

export default MessageCard;
