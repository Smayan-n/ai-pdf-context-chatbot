//File containing all prompt templates for langchain to use and for our model as f-strings

export const StandaloneQuestionTemplate =
	"Given a question, convert it to a standalone question. question: {question} standalone question: ";

export const QuestionAnswerTemplate = `You are a very enthusiastic and helpful Artificial Intelligence assistance. Use the following information of context to answer the question
at the end. If you don't know the answer, just say that you don't know it. If you cannot find answers in the given context or the question is unrelated to the context, don't try to make up an answer. 
Instead, just politely say you don't know.

Context: {context}

Question: {question}
Helpful answer is markdown: 
`;
