// located at /pages/index.js
import { useState, useEffect, useRef } from 'react';
import ChatInput from '../components/ChatInput';
import Chat from '../components/Chat';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'KMED Tours Chat with AI is a service integrated with https://www.kmed.tour/. It serves as a tour guide to introduce Korean tourism to foreigners who visit Korea for the purpose of medical checkup, dental treatment, and oriental medicine treatment. Additionally, it acts as a wellness tourism guide, helping visitors explore wellness and healing opportunities during their stay in Korea.'
    },
    {
      role: 'assistant',
      content: "Hello! This is a chatbot from Kmed.tours. May I know your name, age, and country?"
    }
  ]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingMessageRef = useRef(null);

  useEffect(() => {
    let loadingInterval;

    if (loading) {
      let i = 0;
      loadingInterval = setInterval(() => {
        let message = ".";
        for (let j = 0; j < i; j++) {
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
      <div className="w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-md space-y-4 h-[90vh] flex flex-col"> {/* 높이를 80vh로 변경하고 flex로 설정 */}
        <h2 className="mb-4 text-xl font-bold text-center">KMED Tours Chat with AI</h2>
        <div className="overflow-y-auto no-scrollbar flex-grow p-t-10 p-b-10"> {/* 상하단에 10%의 패딩 추가하고 스크롤 설정 */}
          <Chat messages={messages.concat(loading ? loadingMessage : []).filter(message => message.role !== 'system')} />
        </div>
        <ChatInput onSend={handleChatSubmit} disabled={loading} />
      </div>
    </div>
  );
}
