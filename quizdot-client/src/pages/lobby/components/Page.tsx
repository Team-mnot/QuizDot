import { useEffect, useState, useRef } from 'react';
import { OnlineUserList } from './OnlineUserList';
import { MyProfile } from './MyProfile';
import { RoomList } from './RoomList';

import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp, CompatClient } from '@stomp/stompjs';

import { useParams } from 'react-router-dom';
import { Button, Input } from '@/shared/ui';

interface MessageDto {
  sender: string;
  text: string;
  type: string;
  data: unknown;
}

export function LobbyPage() {
  const { channel } = useParams() as { channel: string };

  const client = useRef<CompatClient | null>(null);
  const socket = new SockJS(`https://k10d102.p.ssafy.io/api/ws/chat`);
  client.current = Stomp.over(socket);

  function onConnect(): void {
    client.current?.connect({}, onSubscribe, onError);
  }

  function onSubscribe(): void {
    console.error('[연결 성공] server -> client');

    client.current?.subscribe(
      `/sub/chat/lobby/${channel}`,

      (message) => {
        const msg: MessageDto = JSON.parse(message.body) as MessageDto;
        setMessages([...messages, msg.text]);
        console.error('[콜백 성공] server -> client');
      },
    );

    // 연결에 실패하면 이전 채널로 돌아갈 것인지 팝업창으로 묻고, OK 하면 돌아감
    // navi(`/channel`, { replace: true });
  }

  // Socket 연결 도중 Error 발생 시 실행될 함수
  function onError(error: unknown): void {
    console.error('[연결 실패] WebSocket Connection Error', error);

    setTimeout(() => {
      console.log('Attempting to reconnect...');
      onConnect(); // 연결 재시도
    }, 3000); // 3초 후 재시도
  }

  // Send 함수
  function onSend(): void {
    if (message.trim() != '' && client) {
      const chatMessage = {
        sender: '익',
        text: message,
        type: null,
        data: null,
      };

      client.current?.send(
        `/pub/chat/lobby/${channel}`,
        {},
        JSON.stringify(chatMessage),
      );

      setMessage('');
      console.log('[전송 성공] Client -> Server');
    }
  }

  // function onUnsubscribe(): void {
  //   client.current?.unsubscribe;
  // }

  // function onDisconnect(): void {
  //   client.current?.onDisconnect;
  // }

  const onEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  const [message, setMessage] = useState<string>(''); // 사용자 입력을 상태로 관리
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    onConnect();
  }, []);

  return (
    <div
      style={{
        backgroundImage: 'url(/images/main_bg.png)',
        backgroundSize: 'cover',
        width: '100%',
        height: '100vh', // 혹은 다른 높이 값
      }}
    >
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
              alert('전송완료');
            }}
          />

          {/* <ChattingBox /> */}
        </div>
      </div>
    </div>
  );
}
