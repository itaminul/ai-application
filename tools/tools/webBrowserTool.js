import { ChatOllama } from "@langchain/ollama"
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const model = new ChatOllama({
    model: "llama3.2:3b",
    temperature: 0
})


const tools = [
    new DynamicTool({
        name: "weather_tool",
        description: "Tool to fetch weather information for a given city",
        func: async (city) => {
            return JSON.stringify({
                city,
                forecast: "sunny",
                temperature: "25°C",
            });
        },
    }),
]

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Use the available tools to answer questions accurately."],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
]);
const agent = createToolCallingAgent({
    llm: model,
    tools,
    prompt,
});


const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    verbose: false
})


const result = await agentExecutor.invoke({
    input: "What is the weather in London?",
});
console.log(result.output);