// src/pages/survival/components/ChattingBox.tsx

import React, { useEffect, useRef, useState } from 'react';

export function ChattingBox() {
  const [messages, setMessages] = useState<string[]>([]); // 채팅 메시지들을 상태로 관리
  const [input, setInput] = useState<string>(''); // 사용자 입력을 상태로 관리
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const newMessages = [...messages, input];
    setMessages(newMessages);
    setInput('');
  };

  useEffect(() => {
    // 메시지 상태가 변경될 때 마다 실행
    if (chatContainerRef.current) {
      // 현재 스크롤 컨테이너의 scrollTop 값을 스크롤 높이로 설정
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // 메시지 배열이 변경될 때마다 이 효과를 재실행

  return (
    <div className="fixed bottom-10 left-0 right-0 mx-auto max-w-3xl rounded-3xl bg-white p-4 shadow-lg">
      {/* 채팅 메시지 표시 영역 */}
      <div className="chat-messages mb-2 h-36 overflow-auto" ref={chatContainerRef}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="chat-message break-words">
              {/* 이 부분에서 각 메시지를 적절한 스타일로 표시합니다. */}
              {message}
            </div>
          ))
        ) : (
          // 채팅이 없을 경우 메시지 영역을 유지합니다.
          <div className="flex h-full items-center justify-center">
            <span className="text-gray-500">메시지가 없습니다.</span>
          </div>
        )}
      </div>

      <div className="flex max-w-3xl">
        {/* 채팅 입력란 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="chat-input flex-grow rounded-l-md border border-gray-300 p-2"
          placeholder="메시지를 입력하세요..."
        />

        {/* 전송 버튼 */}
        <button
          onClick={sendMessage}
          className="send-button ml-2 flex-shrink-0 rounded-r-md px-4 py-2 font-bold"
        >
          전송
        </button>
      </div>
    </div>
  );
}
