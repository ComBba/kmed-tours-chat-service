import { fetchStreamedChatContent } from 'streamed-chatgpt-api';

// Create an object to store chat history
const chatHistory = {};
const historyLength = 5; // Change this value to set the desired chat history length

export default function handler(req, res) {
    if (req.method === 'POST') {
        const apiKey = process.env.OPENAI_API_KEY;
        const { message, username } = req.body;

        // Check if username is provided
        if (!username) {
            return res.status(400).send('A username is required.');
        }

        // Initialize chat history for the user if it doesn't exist
        if (!chatHistory[username]) {
            chatHistory[username] = [];
        }

        // Update chat history with the user's message
        chatHistory[username].push({ role: 'user', content: message });

        // Prepare the message input with the user's chat history
        // just giving an empty string as system role to keep chat ouput short
        const messageInput = [
            {
                role: 'system',
                content: '',
            },
        ];

        const recentHistory = chatHistory[username].slice(-historyLength);
        recentHistory.forEach(msg => {
            messageInput.push(msg);
        });

        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        let completeResponse = '';

        console.log(messageInput)
        fetchStreamedChatContent({
            apiKey,
            messageInput,
            model: 'gpt-4-0613',
            maxTokens: 1000,
            temperature: 0.8,
        }, (content) => {
            res.write(content);
            completeResponse += content;
        }, () => {
            res.end();
            chatHistory[username].push({ role: 'assistant', content: completeResponse });
        },
            () => {
                res.write("I'm sorry, there was an error processing your request.");
                res.end();
            });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
