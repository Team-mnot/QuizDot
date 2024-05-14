// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { Stomp, CompatClient, IMessage } from '@stomp/stompjs';
import { MessageDto } from '../apis/types';
import { baseApi } from '@/shared/apis';

const WebSocketContext = createContext<{
  isReady: boolean;
  callbackMsg: { msg: MessageDto; address: string };
  onConnect: () => void;
  onSubscribe: (address: string) => void;
  onUnsubscribe: (address: string) => void;
  onSend: (address: string, data: any) => void;
  onDisconnect: () => void;
}>({
  isReady: false,
  callbackMsg: {
    msg: { sender: '', data: '', text: '', type: '' },
    address: '',
  },
  onConnect: () => {},
  onSubscribe: () => {},
  onUnsubscribe: () => {},
  onSend: () => {},
  onDisconnect: () => {},
});

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [callbackMsg, setCallbackMsg] = useState<{
    msg: MessageDto;
    address: string;
  }>({ msg: { sender: '', data: '', text: '', type: '' }, address: '' });

  const client = useRef<CompatClient | null>(null);
  // **변경된 부분: 구독 ID를 관리하기 위한 객체 추가**
  const subscriptions = useRef<{ [key: string]: string }>({});
  const wsUrl = `${baseApi}/ws/chat`;

  useEffect(() => {
    onConnect();

    return () => {
      if (isReady) {
        onDisconnect();
      }
    };
  }, []);

  const onConnect = async () => {
    if (isReady) return;
    const socket = Stomp.over(() => new SockJS(wsUrl));

    client.current = socket;
    client.current?.connect(
      {},
      () => {
        setIsReady(true);
        console.log('[소켓 연결 성공 콜백]', isReady);
      },
      (error: any) => {
        console.error('[소켓 연결 실패 콜백]', error);
      },
    );
  };

  const onUnsubscribe = async (address: string) => {
    if (!isReady) return;

    // **변경된 부분: 구독 해제 시 구독 ID를 사용**
    const subscriptionId = subscriptions.current[address];
    if (subscriptionId) {
      client.current?.unsubscribe(subscriptionId);
      delete subscriptions.current[address];
      console.log('[주소 구독 해제 성공]', address);
    }
  };

  const onSubscribe = async (address: string) => {
    if (!isReady) return;

    // **변경된 부분: 중복 구독 방지**
    if (!subscriptions.current[address]) {
      const subscription = client.current?.subscribe(
        `/sub/${address}`,
        (message: IMessage) => {
          const msg: MessageDto = JSON.parse(message.body) as MessageDto;
          setCallbackMsg({ msg: msg, address: address });
          console.log('[클라이언트로 메시지 전달 성공]', msg);
        },
      );

      if (subscription) {
        subscriptions.current[address] = subscription.id;
        console.log('[주소 구독 성공]', address);
      }
    } else {
      console.warn('[이미 구독된 주소 요청]', address);
    }
  };

  const onDisconnect = async () => {
    if (!isReady) return;

    // **변경된 부분: 모든 구독 해제 시 구독 ID를 사용**
    Object.keys(subscriptions.current).forEach((address) => {
      const subscriptionId = subscriptions.current[address];
      if (subscriptionId) {
        client.current?.unsubscribe(subscriptionId);
        delete subscriptions.current[address];
      }
    });

    client.current?.disconnect(() => {
      setIsReady(false);
      console.log('[소켓 연결 해제 성공]');
    }, {});
  };

  const onSend = async (address: string, data: any) => {
    if (!isReady) return;
    client.current?.send(`/pub/chat/${address}`, {}, JSON.stringify(data));
    console.log('[소켓으로 메시지 전달 시작]');
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
