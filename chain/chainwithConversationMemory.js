import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ConversationBufferMemory } from "@langchain/community";
import { RunnableSequence } from "@langchain/core/runnables";
const ollama = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b",
});

// const memory = new ConversationBufferMemory({ memoryKey: "chat_history" });



const memory = new ConversationBufferMemory();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Use the conversation history to answer questions."],
    ["human", "{input}"],
]);

const chain = RunnableSequence([
    {
        input: (input) => input.input,
        history: async () => (await memory.loadMemoryVariables({})).history,
    },
    prompt,
    ollama,
    new StringOutputParser()
])
// Sample document
const questions = [
    "What's the capital of France?",
    "What about Spain?",
    "Can you repeat the first capital I asked about?",
]

for (const question of questions) {
    const response = await chain.invoke({ input: question })
    console.log(`Question: ${question}`)
    console.log(`Response: ${response}\n`)
    await memory.saveContext({ input: question }, { output: response })
}
