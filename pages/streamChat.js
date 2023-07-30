import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const userName = Math.floor(Math.random() * 1000000);

  async function handleSubmit(e) {
    e.preventDefault();
    const sessionUsername = `User ${userName}`;
    const res = await fetch('/api/streamChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: sessionUsername, message })
    });

    const textDecoder = new TextDecoder('utf-8');
    const reader = res.body.getReader();
    let assistantResponse = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      assistantResponse += textDecoder.decode(value, { stream: !done });
      setMessages([...messages, { role: 'assistant', content: assistantResponse }])
    }
    setMessage('');
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-black text-bold">Chat</h1>
          {messages.map((msg, index) => (
            <div key={index} className="flex mb-4">
              <div className={`w-full text-black ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block rounded px-4 py-2 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-grey-lightest'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <input className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-black" placeholder="Type your message" value={message} onChange={handleChange} />
              <button className="flex-no-shrink p-2 border-2 rounded text-white bg-blue-500 border-blue-light hover:text-white hover:bg-blue-700">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
