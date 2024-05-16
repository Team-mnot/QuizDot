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
  onSubscribeWithCallBack: (
    address: string,
    callback: (message: MessageDto) => void,
  ) => void;
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
  onSubscribeWithCallBack: () => {},
  onUnsubscribe: () => {},
  onSend: () => {},
  onDisconnect: () => {},
});

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  // 소켓의 상태를 담은 상태 변수
  const [isReady, setIsReady] = useState<boolean>(false);
  // 소켓의 콜백 내용을 담은 상태 변수
  const [callbackMsg, setCallbackMsg] = useState<{
    msg: MessageDto;
    address: string;
  }>({ msg: { sender: '', data: '', text: '', type: '' }, address: '' });

  // 클라이언트 소켓
  const client = useRef<CompatClient | null>(null);
  // 소켓 구독 ID 관리하는 해시 배열
  const subscriptions = useRef<{ [key: string]: string }>({});
  // 소켓 엔드 포인트 주소
  const wsUrl = `${baseApi}/ws/chat`;

  useEffect(() => {
    onConnect();

    return () => {
      if (isReady) {
        onDisconnect();
      }
    };
  }, []);

  // 소켓 연결
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

  // 소켓 구독 취소
  const onUnsubscribe = async (address: string) => {
    if (!isReady) return;

    const subscriptionId = subscriptions.current[address];
    if (subscriptionId) {
      client.current?.unsubscribe(subscriptionId);
      delete subscriptions.current[address];
      console.log('[주소 구독 해제 성공]', address);
    }
  };

  // 소켓 구독 및 지정 콜백 함수 사용
  const onSubscribeWithCallBack = async (
    address: string,
    callback: (message: MessageDto) => void,
  ) => {
    if (!isReady) return;

    if (!subscriptions.current[address]) {
      const subscription = client.current?.subscribe(
        `/sub/${address}`,
        (message: IMessage) => {
          const msg: MessageDto = JSON.parse(message.body) as MessageDto;
          callback(msg);
          // 혹시 몰라서 추가
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

  // 소켓 구독 및 상태 변수 사용
  const onSubscribe = async (address: string) => {
    if (!isReady) return;

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

  // 소켓 연결 해제
  const onDisconnect = async () => {
    if (!isReady) return;

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

  // 소켓 메시지 전송
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
        onSubscribeWithCallBack,
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
