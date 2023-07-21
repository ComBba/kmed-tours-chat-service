// located at /pages/index.js
import { useState, useEffect, useRef } from 'react';
import ChatInput from '../components/ChatInput';
import Chat from '../components/Chat';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: "hello? This is a chatbot from Kmed.tours. may I know your name, age, and country?" }]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingMessageRef = useRef(null);

  useEffect(() => {
    let loadingInterval;

    if (loading) {
      let i = 0;
      loadingInterval = setInterval(() => {
        let message = ".";
        for(let j = 0; j < i; j++) {
          message += ".";
        }
        setLoadingMessage({ role: 'assistant', content: message });

        if (i >= 5) {
          i = 0;
        } else {
          i++;
        }
      }, 500);
    } else if (loadingMessageRef.current) {
      clearInterval(loadingInterval);
      setLoadingMessage("");
    }

    return () => clearInterval(loadingInterval);
  }, [loading]);

  const handleChatSubmit = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);

    if (newMessages.length > 1) {
      setLoading(true);
      const res = await fetch('/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.text }]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold text-center">Chat with AI</h2>
        <Chat messages={messages.concat(loading ? loadingMessage : [])} />
        <ChatInput onSend={handleChatSubmit} disabled={loading} />
      </div>
    </div>
  );
}