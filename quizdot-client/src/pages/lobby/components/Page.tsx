import { RoomListComponent } from './RoomListComponent';
import { useEffect, useState, useRef } from 'react';
import { OnlineUserListComponent } from './OnlineUserListComponent';
import { MyProfileComponent } from './MyProfileComponent';

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

  // 첫 접속 시 Socket 생성해 연결
  function onConnect(): void {
    const socket = new SockJS(`https://k10d102.p.ssafy.io/api/ws/chat`);

    client.current = Stomp.over(socket);
    client.current.connect({}, onSubscribe);
  }

  // Socket 연결 시 실행
  function onSubscribe(): void {
    try {
      // Subscribe 함수 (CallBack 함수를 포함)
      client.current?.subscribe(
        `/sub/chat/lobby/${channel}`,

        (message) => {
          const msg: MessageDto = JSON.parse(message.body) as MessageDto;
          setMessages([...messages, msg.text]);
          console.error('[콜백 성공] server -> client');
        },
      );
    } catch (error: unknown) {
      onError(error);

      // 연결에 실패하면 이전 채널로 돌아갈 것인지 팝업창으로 묻고, OK 하면 돌아감
      // navi(`/channel`, { replace: true });
    }
  }

  // Socket 연결 도중 Error 발생 시 실행될 함수
  function onError(error: unknown): void {
    console.error('[연결 실패] WebSocket Connection Error', error);
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
      console.log('[연결 성공] Client -> Server');
    }
  }

  // function onUnsubscribe(): void {
  //   client.current?.unsubscribe;
  // }

  // function onDisconnect(): void {
  //   client.current?.onDisconnect;
  // }

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
          <OnlineUserListComponent />
          <RoomListComponent />
        </div>
        <div className={'flex'}>
          <MyProfileComponent />
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
