/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { useRef } from 'react';
import { baseApi } from '@/shared/apis';

// store 추가 예정
class SocketStore {
  private stompInstance = useRef<CompatClient | null>(null);
  private wsUrl = `${baseApi}/ws/chat`;

  public async onConnect(address: string, callback: (message: any) => void) {
    this.stompInstance.current?.onWebSocketClose;

    this.stompInstance.current = Stomp.over(() => new SockJS(this.wsUrl));
    this.stompInstance.current?.connect(
      {},
      () => {
        console.log(
          '[소켓 연결 성공] socket is connected : ',
          this.stompInstance.current?.connected,
        );
        this.onSubscribe(address, callback);
      },
      this.onError,
    );
  }

  public async onSubscribe(address: string, callback: (message: any) => void) {
    if (
      !this.stompInstance.current ||
      !this.stompInstance.current.active ||
      !this.stompInstance.current.connected
    ) {
      console.error(
        '[연결 실패] STOMP client status is : ',
        this.stompInstance.current,
      );
      return;
    }

    this.stompInstance.current?.subscribe(`/sub/chat/${address}`, callback);
  }

  public async onError(error: any) {
    console.error('[연결 실패] ', error);

    //   setTimeout(() => {
    //     console.log('Attempting to reconnect...');
    //     this.onConnect(); // 연결 재시도
    //   }, 3000); // 3초 후 재시도
  }

  public async onSend(address: string, data: any) {
    if (
      !this.stompInstance.current ||
      !this.stompInstance.current.active ||
      !this.stompInstance.current.connected
    ) {
      console.error(
        '[전송 실패] STOMP client status is : ',
        this.stompInstance.current,
      );
      return;
    }

    this.stompInstance.current?.send(
      `/pub/chat/${address}`,
      {},
      JSON.stringify(data),
    );
    console.log('[전송 성공] clinet -> server ', data);
  }

  public async onUnsubscribe() {
    if (
      !this.stompInstance.current ||
      !this.stompInstance.current.active ||
      !this.stompInstance.current.connected
    ) {
      console.error(
        '[구독 해제 실패] STOMP client status is : ',
        this.stompInstance.current,
      );
      return;
    }

    this.stompInstance.current?.unsubscribe;
    console.log('[구독 해제 성공] ', this.stompInstance.current);
  }

  public async onDisconnect() {
    if (!this.stompInstance.current || !this.stompInstance.current.active)
      return;

    this.stompInstance.current?.deactivate();
    this.stompInstance.current?.disconnect({}, {});
    console.log('[연결 해제 성공] ', this.stompInstance.current);
  }
}

export { SocketStore };
