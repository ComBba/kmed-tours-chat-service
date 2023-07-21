// located at /components/Chat.js
import { useEffect, useRef } from 'react';

function Chat({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="p-4 space-y-4 mx-auto"> {/* 너비를 70%로 설정하고 중앙으로 정렬 */}
      {messages.map((message, idx) => (
        <div key={idx} className={`p-2 rounded-md w-[35vh] ${message.role === 'assistant' ? 'bg-blue-500 text-white mr-auto' : 'bg-gray-300 text-black ml-auto'}`}>
        {/* CSS를 이용하여 줄바꿈 적용 */}
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Chat;
