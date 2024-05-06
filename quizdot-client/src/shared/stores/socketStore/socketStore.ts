// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// import SockJS from 'sockjs-client/dist/sockjs';
// import { Stomp, CompatClient } from '@stomp/stompjs';

// interface socketStore {
//   stompInstance: CompatClient | null;
//   onConnect: () => void;
//   onSubscribe: (address: string, callback: (message: any) => void) => void;
//   onError: (error: any) => void;
//   onSend: (address: string, data: any) => void;
//   onUnsubscribe: () => void;
//   onDisconnect: () => void;
// }

// const useSocketStore = create(
//   persist<socketStore>(
//     (set, get) => ({
//       stompInstance: null,
//       onConnect: async () => {
//         const socket = new SockJS(`https://k10d102.p.ssafy.io/api/ws/chat`);

//         set({
//           stompInstance: Stomp.over(socket),
//         }),
//           console.error('[소켓 연결 성공] socket is active');
//       },
//       onSubscribe: async (
//         address: string,
//         callback: (message: any) => void,
//       ) => {
//         get().stompInstance?.connect(
//           {},
//           get().stompInstance?.subscribe(`/sub/chat/${address}`, callback),
//           get().onError,
//         );
//       },
//       onError: async (error: any) => {
//         console.error('[연결 실패] ', error);
//       },
//       onSend: async (address: string, data: any) => {
//         get().stompInstance?.send(
//           `/pub/chat/${address}`,
//           {},
//           JSON.stringify(data),
//         );
//         console.log('[전송 성공] clinet -> server ', data);
//       },
//       onUnsubscribe: async () => {
//         get().stompInstance?.unsubscribe;
//         console.log('[구독 해제 성공] ', get().stompInstance?.active);
//       },
//       onDisconnect: async () => {
//         get().stompInstance?.disconnect({}, {});
//         console.log('[연결 해제 성공] ', get().stompInstance?.active);
//       },
//     }),
//     {
//       name: 'socketStorage',
//     },
//   ),
// );

// export { useSocketStore };
