import { ChatOllama } from "@langchain/ollama";
import fs from 'fs';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import express from "express";
import multer from "multer";
import * as XLSX from "xlsx"
import { parse } from "csv-parse/sync";
const model = new ChatOllama({
    model: 'llama3.2:3b',
});

const app = express();
const upload = multer({ dest: "uploads/" });

async function processFile(filePath) {
    const ext = filePath.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext)) {
        const base64 = fs.readFileSync(filePath).toString("base64");
        return { type: "image", content: `data:image/${ext};base64,${base64}` };
    }

    if (ext === "pdf") {
        console.log("pdf");
        const data = await PdfParse(fs.readFileSync(filePath));
        return { type: "pdf", content: data.text.slice(0, 1000) };

    }

    if (ext === "txt") {
        const text = fs.readFileSync(filePath, "utf-8");
        return { type: "text", content: text.slice(0, 1000) };
    }

    if (ext === "csv") {
        const data = fs.readFileSync(filePath);
        const records = parse(data, { columns: true });
        return { type: "csv", content: JSON.stringify(records.slice(0, 5)) };
    }

    if (ext === "xlsx") {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        return { type: "xlsx", content: JSON.stringify(json.slice(0, 5)) };
    }


    return { type: "unknown", content: "Unsupported file type" };
}

// -----------------------------
async function buildPrompt(fileInfo) {
    const messages = [
        [
            "system",
            `You are a multimodal AI assistant. 
      You analyze different file types (image, audio, video, pdf, csv, xlsx, text, docx).
      Always return JSON strictly in this format:
      { "file_type": string, "extracted_content": string | object, "analysis": string }`
        ],
        [
            "user",
            `File Type: ${fileInfo.type}\nExtracted Content:\n${fileInfo.content}`
        ]
    ];

    if (fileInfo.type === "image") {
        messages[1][1] = [
            { type: "text", text: "Please analyze this image:" },
            { type: "image_url", image_url: fileInfo.content }
        ];
    }

    const prompt = ChatPromptTemplate.fromMessages(messages);
    return prompt.formatMessages({});
}
app.post("/analyze", upload.single("file"), async (req, res) => {
    console.log("REQ.FILE:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Use field name 'file'" });
    }

    const filePath = req.file.path;
    const fileInfo = await processFile(filePath, req.file.originalname);

    res.json(fileInfo);
});


// -----------------------------
// Start Server
// -----------------------------
app.listen(3000, () => {
    console.log("🚀 API running on http://localhost:3000");
});