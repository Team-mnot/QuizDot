import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

import { useRouter } from '@/shared/hooks';
import { getQuizzes } from '@/shared/apis/commonApi';
import { useGameStore } from '@/shared/stores/connectionStore/gameStore';
import { MessageDto } from '@/shared/apis/types';

export function RoomChattingBox({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  const router = useRouter();
  const userStore = useUserStore();
  const gameStore = useGameStore();
  const { isReady, onSend, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const handleSubmitMessage = (message: string) => {
    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`room/${roomId}`, chattingMessage);
  };

  //   입장하기 전에 문제를 받아서 이동
  const handleEnterRoomWithQuiz = async () => {
    if (gameStore.roomInfo) {
      await getQuizzes(
        gameStore.roomInfo.roomId,
        gameStore.roomInfo.category,
        gameStore.roomInfo.maxQuestion,
        gameStore.roomInfo.gameMode,
      );
    }
  };

  const callbackOfChat = async (message: MessageDto) => {
    // 게임 시작 요청이 성공함
    if (message.type == 'START') {
      if (!gameStore.roomInfo) return;

      const callbackOfQuiz = async (message: MessageDto) => {
        router.routeToWithData(`/${channelId}/${roomId}/normal`, message.data);
      };

      onSubscribeWithCallBack(`quiz/game/${roomId}`, callbackOfQuiz);
      if (gameStore.roomInfo.hostId == userStore.id) handleEnterRoomWithQuiz();
      //onUnsubscribe(`quiz/game/${roomId}`);
    }

    // 플레이어들의 채팅을 받음
    else if (message.type == 'CHAT') {
      setMessages((msg) => [
        ...msg,
        {
          nickname: message.sender,
          content: message.text,
        },
      ]);
    }
  };

  // 구독 및 구독 해제
  useEffect(() => {
    onSubscribeWithCallBack(`chat/room/${roomId}`, callbackOfChat);

    return () => {
      onUnsubscribe(`chat/room/${roomId}`);
    };
  }, [isReady]);

  return <ChattingBox onSend={handleSubmitMessage} messages={messages} />;
}
