import { ChatOllama } from "@langchain/ollama";
import fs from 'fs';
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOllama({
    model: 'llama3.2:3b',
});


function loadImageBase64(path) {
    return fs.readFileSync(path).toString();
}

async function buildPrompt(userChoice, options) {
    let messages = [
        [
            "system",
            `You are a multimodal assistant. You must always return strict JSON in the format: { "type": string, "decoded_value": string, "analysis": string}`
        ]
    ]
        ;

    if (userChoice === "image") {
        messages.push([
            "user",
            [
                { type: "text", text: "Analyze this image and describe it." },
                { type: "image_url", image_url: `data:image/png;base64,${options.imageBase64}` }
            ]
        ])

        if (userChoice === "barcode") {
            messages.push([
                "user",
                [
                    { type: "text", text: "Scan this QR/Barcode and return the decoded value." },
                    { type: "image_url", image_url: `data:image/png;base64,${options.imageBase64}` }
                ]
            ]);
        }

        if (userChoice === "medical") {
            messages.push([
                "user",
                [
                    { type: "text", text: "Analyze this medical X-ray and consider the report text too." },
                    { type: "image_url", image_url: `data:image/png;base64,${options.imageBase64}` }
                ]
            ]);
            messages.push(["user", `Here is the doctor's report: ${options.reportText}`]);
        }

        const prompt = ChatPromptTemplate.fromMessages(messages)
        return prompt.formatMessages({})
    }
}


async function runChain(userChoice) {
    const imageBase64 = loadImageBase64("sample.png")
    const reportText = "Patient has mild cough. Possible lung infection."
    const formattedPrompt = await buildPrompt(userChoice, { imageBase64, reportText })
    const response = await model.invoke(formattedPrompt);
    console.log(" Raw response", response.content)

    try {
        const parsed = JSON.parse(response.content[0].text)
        console.log(" Parsed JSON:", parsed)
    } catch (error) {
        console.log(" Could not parse JSON, got: ", response.content)
    }
}

runChain("image")
