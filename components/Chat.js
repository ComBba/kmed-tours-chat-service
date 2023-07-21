// located at /components/Chat.js
import { useEffect, useRef } from 'react';

function Chat({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="p-4 overflow-y-auto no-scrollbar space-y-4 h-[80vh]">
      {messages.map((message, idx) => (
        <div key={idx} className={`max-w-lg mx-2 p-2 rounded-md ${message.role === 'assistant' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 mr-auto'}`}>
          {message.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Chat;
