import express from 'express'
import bodyParser from 'body-parser'
const app = express();
app.use(bodyParser.json())
const OLLAMA_API_URL = 'http:localhost:11434/api/generate';

app.post('/chat', async (req, res) => {
    const { message } = req.body
    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:3b',
                prompt: message,
                stream: false
            })
        })
        const data = await response.json()
        res.json({ reply: data.response.trim() })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error communicating with Ollama' });

    }
})
app.listen(3000, () => {
    console.log('Chatbot server running at http://localhost:3000');
});