import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Define schema
const reviewSchema = z.object({
    reviewedText: z.string().describe("The corrected and reviewed text"),
});

// Initialize with function binding
const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b", 
}).bind({
    functions: [
        {
            name: "store_review",
            description: "Stores the reviewed text",
            parameters: zodToJsonSchema(reviewSchema),
        },
    ],
    function_call: { name: "store_review" },  // Force this function
});

// Prompt template
const prompt = PromptTemplate.fromTemplate(
    `Review and correct grammar in the following text.
  Text: {inputText}`
);

// Chain: prompt -> LLM -> parser
const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// Invoke and log
const response = await chain.invoke({ inputText: "This is a sentance with errrors." });
console.log(response);  