import { useEffect, useState } from 'react';

import { SocketStore } from '@/shared/stores/connectionStore/socket';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { IMessage } from '@stomp/stompjs';

interface MessageDto {
  sender: string;
  text: string;
  type: string;
  data: unknown;
}

export function LobbyChattingBox({
  channelId,
  stompInstance,
}: {
  channelId: number;
  stompInstance: SocketStore;
}) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const userStore = useUserStore();

  const onSend = (message: string) => {
    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: null,
      data: null,
    };

    stompInstance.onSend(`lobby/${channelId}`, chattingMessage);
  };

  const onCallBack = async (message: IMessage) => {
    const msg: MessageDto = JSON.parse(message.body) as MessageDto;
    console.error('[콜백 성공] server -> client ', msg);

    setMessages((messages) => [
      ...messages,
      { nickname: msg.sender, content: msg.text },
    ]);
  };

  useEffect(() => {
    stompInstance.onConnect(`chat/lobby/${channelId}`, onCallBack);
  }, []);

  return <ChattingBox onSend={onSend} messages={messages} />;
}
