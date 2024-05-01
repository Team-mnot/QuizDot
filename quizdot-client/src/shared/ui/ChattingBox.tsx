// src/shared/ui//ChattingBox.tsx

import { Button } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';

const dummyUserData = {
  nickname: '김익환',
};

export function ChattingBox() {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);
  const [input, setInput] = useState<string>(''); // 사용자 입력을 상태로 관리
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const newMessage = { nickname: dummyUserData.nickname, content: input };
    const newMessages = [...messages, newMessage];
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
    <div
      className={
        'fixed bottom-3 left-0 right-0 mx-auto max-w-3xl rounded-3xl bg-white bg-opacity-80 p-4'
      }
    >
      {/* 채팅 메시지 표시 영역 */}
      <div
        className={'chat-messages mb-2 h-36 overflow-auto'}
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          <div key={index} className={'chat-message flex break-words text-sm '}>
            {/* 이렇게 하려면 닉네임 6자 이하라던가 기준이 있어야 할 듯 */}
            <div className={'min-w-max pr-[80px]'}>{message.nickname}</div>
            <div className={''}>{message.content}</div>
          </div>
        ))}
      </div>

      <div className="flex w-full">
        {/* 채팅 입력란 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className={
            'chat-input flex-grow rounded-l-md border border-gray-300 pl-4'
          }
          placeholder="메시지를 입력하세요..."
        />

        {/* 전송 버튼 */}
        <Button className="ml-2" value="전송" onClick={sendMessage} />
      </div>
    </div>
  );
}
