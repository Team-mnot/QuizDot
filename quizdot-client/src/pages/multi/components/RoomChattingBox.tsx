import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';

export function RoomChattingBox({ roomId }: { roomId: number }) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const userStore = useUserStore();
  const { isReady, onSend, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const handleSubmitMessage = (message: string) => {
    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`room/${roomId}`, chattingMessage);
  };

  const callback = (message: MessageDto) => {
    if (message.type == 'CHAT') {
      setMessages((msg) => [
        ...msg,
        {
          nickname: message.sender,
          content: message.text,
        },
      ]);
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`chat/room/${roomId}`, callback);

    return () => {
      onUnsubscribe(`chat/room/${roomId}`);
    };
  }, [isReady]);

  return <ChattingBox onSend={handleSubmitMessage} messages={messages} />;
}
