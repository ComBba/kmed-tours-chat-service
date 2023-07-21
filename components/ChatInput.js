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
      <form className="m-2" onSubmit={handleFormSubmit}>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit" className="w-full py-2 mt-2 font-bold text-white bg-blue-500 rounded-md">
          Send
        </button>
      </form>
    );
  }
  
  export default ChatInput;
  