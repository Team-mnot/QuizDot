import { useEffect, useState } from 'react';

import { SocketStore } from '@/shared/stores/connectionStore/socket';

import { ChattingBox } from '@/shared/ui/ChattingBox';

interface MessageDto {
  sender: string;
  text: string;
  type: string;
  data: unknown;
}

interface LobbyChattingBoxProps {
  channelId: number;
  stompInstance: SocketStore;
}

export function LobbyChattingBox(props: LobbyChattingBoxProps) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const onSend = (message: string) => {
    const chatMessage = {
      sender: '익',
      text: message,
      type: null,
      data: null,
    };

    props.stompInstance.onSend(`lobby/${props.channelId}`, chatMessage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCallBack = async (message: any) => {
    const msg: MessageDto = JSON.parse(message.body) as MessageDto;
    console.error('[콜백 성공] server -> client ', msg);

    setMessages((messages) => [
      ...messages,
      { nickname: msg.sender, content: msg.text },
    ]);
  };

  useEffect(() => {
    props.stompInstance.onConnect(`lobby/${props.channelId}`, onCallBack);
  }, []);

  return (
    <div>
      <ChattingBox onSend={onSend} messages={messages} />
    </div>
  );
}
