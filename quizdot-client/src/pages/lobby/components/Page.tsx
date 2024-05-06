import { useEffect, useState } from 'react';
import { OnlineUserList } from './OnlineUserList';
import { MyProfile } from './MyProfile';
import { RoomList } from './RoomList';

import { useParams } from 'react-router-dom';
import { Button, Input } from '@/shared/ui';

import { SocketStore } from '@/shared/stores/socketStore/socket';

interface MessageDto {
  sender: string;
  text: string;
  type: string;
  data: unknown;
}

export function LobbyPage() {
  const { channel } = useParams() as { channel: string };

  const stompInstance = new SocketStore();

  const [message, setMessage] = useState<string>(''); // 사용자 입력을 상태로 관리
  const [messages, setMessages] = useState<string[]>([]);

  const onEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  const onSend = () => {
    if (message.trim() != '') {
      const chatMessage = {
        sender: '익',
        text: message,
        type: null,
        data: null,
      };

      stompInstance.onSend(`lobby/${channel}`, chatMessage);
      setMessage('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCallBack = async (message: any) => {
    const msg: MessageDto = JSON.parse(message.body) as MessageDto;
    setMessages([...messages, msg.text]);
    console.error('[콜백 성공] server -> client ', msg);
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';

    stompInstance.onConnect(`lobby/${channel}`, onCallBack);
  }, []);

  return (
    <div>
      <h1>로비</h1>
      <div className={'flex'}>
        <OnlineUserList />
        <RoomList />
      </div>
      <div className={'flex'}>
        <MyProfile />
        <div>
          {messages.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <Input
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.currentTarget.value)
          }
          onKeyPress={onEnterSubmit}
        />
        <Button
          value="전송"
          onClick={() => {
            onSend();
          }}
        />

        {/* <ChattingBox /> */}
      </div>
    </div>
  );
}
