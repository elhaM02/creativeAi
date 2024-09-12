import Express from 'express';
import { Server } from 'socket.io';
import http from 'http';

import dotenv from 'dotenv';
dotenv.config()

import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Groq from 'groq-sdk';


let groq = new Groq({apiKey: process.env.llama_apiKey})
console.log(process.env.llama_apiKey)

let systemPrompt = 'your the coolest person ever and you curse alot and keep your talking to your homies over whatsapp'
let chatHistory = [{role: 'system', content: systemPrompt}]

const app = Express();

const server = http.createServer(app)

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('connected', socket.id)
    socket.emit('message', 'hello mate')

    socket.on('userMessage', async (inp) => {

        chatHistory.push({role: 'user', content: inp});
        console.log(`user Input: ${inp}`)
    
        try {
            let response = await getChat('llama3-70b-8192', chatHistory);
            console.log(response);
            socket.emit("aiResponse", response);
        } catch(err) {
            console.log(err.status)
        }
    })

    socket.on('fuck', (msg) => {
        console.log(msg)
    })
})



app.use(Express.json())
app.use(Express.static(join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'main.html'))
})


async function getChat(model, chats) {
    try {
        const response = await groq.chat.completions.create({
            messages: chats,
            model,
            temperature: 1,
            max_tokens: 8000,
        });
        
        let AiResponse = response.choices[0]?.message?.content;
        return AiResponse;

    } catch (err) {
        console.log(err.status, 'completion error')
    }
}

server.listen(3000, console.log('http://localhost:3000'))