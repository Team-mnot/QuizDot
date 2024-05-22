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
    if (message.trim() == '') return;

    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`lobby/${channelId}`, chattingMessage);
  };

  useEffect(() => {
    if (
      callbackMsg.msg &&
      callbackMsg.address == `chat/lobby/${channelId}` &&
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
  }, [callbackMsg]);

  return <ChattingBox onSend={handleSubmitMessage} messages={messages} />;
}
