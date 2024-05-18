import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';

export function RoomChattingBox({
  roomId,
  visible,
}: {
  roomId: number;
  visible: boolean;
}) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const userStore = useUserStore();
  const { isReady, onSend, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const handleSubmitMessage = (message: string) => {
    if (message.trim() == '') return;

    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`game/${roomId}`, chattingMessage);
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
    onSubscribeWithCallBack(`chat/game/${roomId}`, callback);

    return () => {
      onUnsubscribe(`chat/game/${roomId}`);
    };
  }, [isReady]);

  if (visible) {
    return <ChattingBox onSend={handleSubmitMessage} messages={messages} />;
  } else return null;
}
