import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

import { useRouter } from '@/shared/hooks';
import { getQuizzes } from '@/shared/apis/commonApi';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { MessageDto } from '@/shared/apis/types';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';
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
  const quizSetStore = useQuizSetStore();
  const userStore = useUserStore();
  const roomStore = useRoomStore();
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
    if (roomStore.roomInfo) {
      await getQuizzes(
        roomStore.roomInfo.roomId,
        roomStore.roomInfo.category,
        roomStore.roomInfo.maxQuestion,
        roomStore.roomInfo.gameMode,
      );
    }
  };

  const callbackOfChat = async (message: MessageDto) => {
    // 게임 시작 요청이 성공함
    if (message.type == 'MULTI') {
      if (!roomStore.roomInfo) return;

      const callbackOfQuiz = async (message: MessageDto) => {
        quizSetStore.fetchQuizzes(message.data);

        onUnsubscribe(`quiz/game/${roomId}`);
        router.routeTo(`/${channelId}/${roomId}/normal`);
      };

      onSubscribeWithCallBack(`quiz/game/${roomId}`, callbackOfQuiz);
      if (roomStore.roomInfo.hostId == userStore.id) handleEnterRoomWithQuiz();
    }

    // 게임 시작 요청이 성공함
    else if (message.type == 'ILGITO') {
      if (!roomStore.roomInfo) {
        return;
      }
      console.log('게임 시작할 것');
      quizSetStore.setGameState(true);
      router.routeTo(`/${channelId}/${roomId}/ilgito`);
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

  useEffect(() => {
    quizSetStore.reset();
  }, []);

  return <ChattingBox onSend={handleSubmitMessage} messages={messages} />;
}
