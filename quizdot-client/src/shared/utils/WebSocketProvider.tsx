// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import { baseApi } from '@/shared/apis';
import { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import { Stomp, CompatClient, IMessage } from '@stomp/stompjs';
import { MessageDto } from '../apis/types';

const WebSocketContext = createContext<{
  isReady: boolean;
  callbackMsg: MessageDto | null;
  onConnect: () => void;
  onSubscribe: (address: string) => void;
  onUnsubscribe: (address: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSend: (address: string, data: any) => void;
  onDisconnect: () => void;
}>({
  isReady: false,
  callbackMsg: null,
  onConnect: () => {},
  onSubscribe: () => {},
  onUnsubscribe: () => {},
  onSend: () => {},
  onDisconnect: () => {},
});

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [callbackMsg, setCallbackMsg] = useState<MessageDto | null>(null);

  const client = useRef<CompatClient | null>(null);
  const wsUrl = `${baseApi}/ws/chat`;

  useEffect(() => {
    onConnect();

    return () => {
      if (isReady) {
        onUnsubscribe('');
        onDisconnect();
      }
    };
  }, []);

  const onConnect = async () => {
    if (isReady) return;
    const socket = Stomp.over(() => new SockJS(wsUrl));

    client.current = socket;
    client.current?.connect({}, onConnected, onError);
  };

  const onConnected = async () => {
    setIsReady(true);
    console.log('[소켓 연결 성공 콜백]', isReady);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = async (error: any) => {
    setIsReady(false);
    console.error('[소켓 연결 실패 콜백]', error);

    // setTimeout(() => {
    //   console.log('[소켓 재연결 시작]');
    //   onConnect();
    // }, 1000);
  };

  const onUnsubscribe = async (address: string) => {
    if (!isReady) return;
    client.current?.unsubscribe(`/sub/${address}`);
    console.log('[주소 구독 해제 성공]', `/sub/${address}`);
  };

  // 구독 시마다 콜백 함수 연결해야 하는 것 개선하기
  const onSubscribe = async (address: string) => {
    if (!isReady) return;
    client.current?.subscribe(`/sub/${address}`, onCallBack);
    console.log('[주소 구독 성공]', `/sub/${address}`);
  };

  const onDisconnect = async () => {
    if (!isReady) return;
    client.current?.disconnect({}, {});
    setIsReady(false);
    console.log('[소켓 연결 해제 성공]');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSend = async (address: string, data: any) => {
    if (!isReady) return;
    client.current?.send(`/pub/chat/${address}`, {}, JSON.stringify(data));
    console.log('[소켓으로 메시지 전달 시작]');
  };

  const onCallBack = async (message: IMessage) => {
    const msg: MessageDto = JSON.parse(message.body) as MessageDto;
    setCallbackMsg(msg);
    console.log('[클라이언트로 메시지 전달 성공]', msg);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isReady,
        callbackMsg,
        onConnect,
        onSubscribe,
        onUnsubscribe,
        onSend,
        onDisconnect,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
