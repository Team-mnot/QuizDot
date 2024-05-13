import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function RoomChattingBox({ roomId }: { roomId: number }) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const userStore = useUserStore();
  const { onSend, callbackMsg } = useContext(WebSocketContext);

  const handleSubmitMessage = (message: string) => {
    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`room/${roomId}`, chattingMessage);
  };

  //   콜백 시 해당 플레이어의 말풍선의 value 로도 설정 추가
  //   잠깐 보이도록 하는 이벤트 발생 추가
  //   채팅 영역 말고 캐릭터 영역에서 설정하면 된다
  useEffect(() => {
    if (callbackMsg && callbackMsg.type == 'CHAT') {
      setMessages((messages) => [
        ...messages,
        { nickname: callbackMsg.sender, content: callbackMsg.text },
      ]);
    }
  }, [callbackMsg]);

  return <ChattingBox onSend={handleSubmitMessage} messages={messages} />;
}
