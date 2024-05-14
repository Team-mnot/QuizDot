// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import { baseApi } from '@/shared/apis';
import { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import { Stomp, CompatClient, IMessage } from '@stomp/stompjs';
import { MessageDto } from '../apis/types';

const WebSocketContext = createContext<{
  isReady: boolean;
  // cbMsg: {
  //   [address: string]: MessageDto;
  // };
  callbackMsg: { msg: MessageDto; address: string };
  onConnect: () => void;
  onSubscribe: (address: string) => void;
  onUnsubscribe: (address: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSend: (address: string, data: any) => void;
  onDisconnect: () => void;
}>({
  isReady: false,
  // cbMsg: {},
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
  // const [cbMsg, setCbMsg] = useState<{
  //   [address: string]: MessageDto;
  // }>({});
  const [callbackMsg, setCallbackMsg] = useState<{
    msg: MessageDto;
    address: string;
  }>({ msg: { sender: '', data: '', text: '', type: '' }, address: '' });

  const client = useRef<CompatClient | null>(null);
  const wsUrl = `${baseApi}/ws/chat`;

  useEffect(() => {
    onConnect();

    return () => {
      if (isReady) {
        // Object.keys(cbMsg.current).forEach((address) => onUnsubscribe(address));
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
    // if (cbMsg[address]) {
    client.current?.unsubscribe(`/sub/${address}`);
    // delete cbMsg[address];
    console.log('[주소 구독 해제 성공]', `/sub/${address}`);
    // }
  };

  // 구독 시마다 콜백 함수 연결해야 하는 것 개선하기
  const onSubscribe = async (address: string) => {
    if (!isReady) return;
    // if (cbMsg[address]) {
    //   console.warn('[이미 구독된 주소 요청]', address);
    //   return;
    // }

    const subscription = client.current?.subscribe(
      `/sub/${address}`,
      (message: IMessage) => {
        const msg: MessageDto = JSON.parse(message.body) as MessageDto;
        // cbMsg[address] = msg;
        setCallbackMsg({ msg: msg, address: address });
        console.log('[클라이언트로 메시지 전달 성공]', msg);
      },
    );

    if (subscription) {
      // setCbMsg((prevCbMsg) => ({
      //   ...prevCbMsg,
      //   [address]: { sender: '', data: '', text: '', type: '' } as MessageDto,
      // }));
      console.log('[주소 구독 성공]', `/sub/${address}`);
    }
  };

  const onDisconnect = async () => {
    if (!isReady) return;

    client.current?.disconnect(() => {
      setIsReady(false);
      console.log('[소켓 연결 해제 성공]');
    }, {});
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSend = async (address: string, data: any) => {
    if (!isReady) return;
    client.current?.send(`/pub/chat/${address}`, {}, JSON.stringify(data));
    console.log('[소켓으로 메시지 전달 시작]');
  };

  return (
    <WebSocketContext.Provider
      value={{
        isReady,
        // cbMsg,
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
