import { ChatOllama } from "@langchain/ollama"
import { Calculator } from "langchain/tools/calculator";

const model = new ChatOllama({
    model: "llama3.2:3b",
    temperature: 0
})

const tools = [
    new Calculator()
]