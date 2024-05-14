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
  const [isView, setIsView] = useState<boolean>(true);

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
    if (
      callbackMsg.msg &&
      callbackMsg.address == `chat/room/${roomId}` &&
      callbackMsg.msg.type == 'CHAT'
    ) {
      setMessages((msg) => [
        ...msg,
        {
          nickname: callbackMsg.msg.sender,
          content: callbackMsg.msg.text,
        },
      ]);
    }
    // else if (
    //   callbackMsg.msg &&
    //   callbackMsg.address == `chat/room/${roomId}` &&
    //   callbackMsg.msg.type == 'CHAT'
    // ) {
    //   setIsView(false);
    // }

    // 빌드 오류 나서 넣음
    setIsView(true);
  }, [callbackMsg]);

  return (
    <div>
      {isView && (
        <ChattingBox onSend={handleSubmitMessage} messages={messages} />
      )}
    </div>
  );
}
