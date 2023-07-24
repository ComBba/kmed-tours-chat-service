// located at /pages/index.js
import { useState, useEffect, useRef } from 'react';
import SearchInput from '../components/SearchInput';
import ChatInput from '../components/ChatInput';
import Chat from '../components/Chat';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'KMED Tours Chat with AI is a service integrated with https://www.kmed.tours/. It serves as a tour guide to introduce Korean tourism to foreigners who visit Korea for the purpose of medical checkup, dental treatment, and oriental medicine treatment. Additionally, it acts as a wellness tourism guide, helping visitors explore wellness and healing opportunities during their stay in Korea.'
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

  const [galleryLoading, setGalleryLoading] = useState(false); // 갤러리 로딩 상태 추가

  const fetchData = async () => {
    setGalleryLoading(true); // 데이터를 로드하기 시작할 때 로딩 상태를 true로 설정
    try {
      const response = await fetch(
        `/api/gallerySearch?keyword=${keyword}`
      );
      console.log("[PAGE response]", response);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setData(null);
      setError(err.toString());
    }
    setGalleryLoading(false); // 데이터 로드가 완료되면 로딩 상태를 false로 설정
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/2 p-4 overflow-y-auto">
        <SearchInput onSearch={setKeyword} onSearchSubmit={fetchData} />
        <div className="flex flex-wrap justify-around">
          {galleryLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <img
                  src="https://api.visitkorea.or.kr/static/media/kto_logo.4faffe39.png"
                  className="animate-pulse"
                  alt="loading"
                />
                <p>Loading...</p>
              </div>
            </div>
          ) : data && data.item ? (
            data.item.map((item, index) => (
              <div key={index} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 relative h-48 w-full md:w-48">
                <img className="h-full w-full object-cover" src={item.galWebImageUrl} alt={item.galTitle} />

                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2">
                  <div className="uppercase tracking-wide text-2xs font-semibold">{item.galTitle}</div>
                  <p className="text-xs">{item.galPhotographer}</p>
                </div>

                <div className="info-overlay absolute top-0 left-0 h-full w-full bg-black bg-opacity-50 text-white p-4 opacity-0 hover:opacity-100 transition-opacity duration-200 text-left flex flex-wrap">
                  <p className="text-xs text-left">고유번호: {item.galContentId}</p>
                  <p className="text-xs text-left">컨텐츠타입: {item.galContentTypeId}</p>
                  <p className="text-xs text-left">작성일자: {item.galCreatedtime}</p>
                  <p className="text-xs text-left">수정일자: {item.galModifiedtime}</p>
                  <p className="text-xs text-left">촬영일자: {item.galPhotographyMonth}</p>
                  <p className="text-xs text-left">촬영장소: {item.galPhotographyLocation}</p>
                  <p className="text-xs text-left">검색키워드: {item.galSearchKeyword}</p>
                </div>
              </div>
            ))
          ) : error && <p>{error}</p>
          }
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center p-4 bg-white">
        <h2 className="mb-4 text-xl font-bold text-center text-black">KMED Tours Chat with AI</h2>
        <div className="w-full max-w-md px-4 py-2 bg-white rounded-lg shadow-md space-y-4 h-[90vh] flex flex-col">
          <div className="overflow-y-auto no-scrollbar flex-grow p-t-10 p-b-10">
            <Chat messages={messages.concat(loading ? loadingMessage : []).filter(message => message.role !== 'system')} />
          </div>
          <ChatInput onSend={handleChatSubmit} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
