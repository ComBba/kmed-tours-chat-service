// located at /components/ChatInput.js
import { useState } from 'react';

function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSend(message);
    setMessage("");
  };

  return (
    <form className="m-2 flex items-center" onSubmit={handleFormSubmit}>
      <input
        className="flex-grow p-2 border border-gray-300 rounded-md text-black"
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className={`ml-2 py-2 px-4 font-bold rounded-md ${message.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-blue-400'}`}
        disabled={message.length === 0}
      >
        ➡️
      </button>
    </form>
  );
}

export default ChatInput;

