//File containing all prompt templates for langchain to use and for our model as f-strings

export const StandaloneQuestionTemplate =
	"Given a question, convert it to a standalone question. question: {question} standalone question: ";

export const QuestionAnswerTemplate = `You are a very enthusiastic AI assistant. Use the following context and your previous conversation history with the human to answer the question
at the end. If you don't know the answer, just say that you don't know it. If you cannot find answers in the given context or the question is unrelated to the context, don't try to make up an answer. 
Instead, just politely say you don't know. Although you can use the conversation history to answer the question if it is relevant. 

Context: {context}
Conversation History: {conversationHistory}

Question: {question}
Helpful answer: 
`;

export const similaritySearchTemplate = `given information, you are to understand it and format in a better
way to make it easier to read. But ensure that you, UNDER NO CIRCUMSTANCES CHANGE THE INFORMATION! Keep the words
as is, just format it to make sense. I only want you to add the word "__POINT__" in front of every different point or sentence or piece
of information that looks different.

information: {information}

response: 
`;

// export const similaritySearchTemplate = `given the following information, please clean up the formatting and make it easier to read by splitting different information and sentences into separate
// lines. BUT DO NOT CHANGE ANY OF THE INFORMATION. KEEP THE TEXT EXACTLY HOW IT IS. Give me back the formatted text in markdown format.

// information: {information}

// response in markdown format:
// `;
