import { useContext, useEffect, useState } from 'react';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

import { useRouter } from '@/shared/hooks';
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
    if (message.trim() == '') return;

    const chattingMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };

    onSend(`room/${roomId}`, chattingMessage);
  };

  const callbackOfChat = async (message: MessageDto) => {
    // 플레이어들의 채팅을 받음
    if (message.type == 'CHAT') {
      setMessages((msg) => [
        ...msg,
        {
          nickname: message.sender,
          content: message.text,
        },
      ]);
    }
    // 게임 시작 요청이 성공함
    else if (message.type == 'MULTI') {
      if (!roomStore.roomInfo) return;

      quizSetStore.clearQuiz();
      quizSetStore.clearQuizzes();
      quizSetStore.clearScores();
      quizSetStore.setGameState(true);
      router.routeTo(`/${channelId}/${roomId}/normal`);
    }
    // 게임 시작 요청이 성공함
    else if (message.type == 'ILGITO') {
      if (!roomStore.roomInfo) return;

      quizSetStore.clearQuiz();
      quizSetStore.clearQuizzes();
      quizSetStore.clearScores();
      quizSetStore.setGameState(true);
      router.routeTo(`/${channelId}/${roomId}/ilgito`);
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
