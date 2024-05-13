import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function LobbyChattingBox({ channelId }: { channelId: number }) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const userStore = useUserStore();
  const { callbackMsg, onSend } = useContext(WebSocketContext);

  const handleSubmitMessage = (message: string) => {
    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`lobby/${channelId}`, chattingMessage);
  };

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
