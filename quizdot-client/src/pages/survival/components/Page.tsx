// src/pages/survival/components/Page.tsx

import { useEffect, useState, useContext } from 'react';
import useQuizStore from '../store';

import { CharacterPreview } from './CharacterPreview';
// import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBoxBlind } from '@/shared/ui/ChattingBoxBlind';
import { QuizComponent } from './QuizComponent';
import { QuizResultComponent } from './QuizResultComponent';
import { CountDown } from './CountDown';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { useParams } from 'react-router-dom';

export function SurvivalPage() {
  const { roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const {
    showChatBox,
    showResult,
    setShowResult,
    setShowCountDown,
    showCountDown,
    setQuizzes,
  } = useQuizStore();

  const { onSend, onSubscribe, callbackMsg } = useContext(WebSocketContext);
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);
  const userStore = useUserStore();

  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/SurvivalBackground.png)';
    document.body.style.backgroundSize = 'cover';

    // TODO : 나중에 Props로 넘기던가 어쩌구로 설정 바까라

    onSubscribe(`chat/game/${roomId}`);
    onSubscribe(`quiz/game/${roomId}`); // 퀴즈 받을 구독 주소 임니다
    setShowCountDown(true);

    if (callbackMsg && callbackMsg.type == 'CHAT') {
      setMessages((messages) => [
        ...messages,
        { nickname: callbackMsg.sender, content: callbackMsg.text },
      ]);
    } else if (callbackMsg && callbackMsg.type == 'PASS') {
      setShowResult(true);
    } else if (callbackMsg && callbackMsg.type === 'QUIZ') {
      setQuizzes(callbackMsg.data.quizResList);
    }

    // 생각해보니까 이건 대기실 API잖아 ..
    // stompInstance.current.onSubscribe(`info/game/${roomId}`, onCallBack);
    // stompInstance.current.onSubscribe(`players/game/${roomId}`, onCallBack);
  }, [callbackMsg]);

  const handleSubmitMessage = (message: string) => {
    const chatMessage = {
      sender: userStore.nickname,
      text: message,
      type: 'CHAT',
      data: null,
    };
    onSend(`game/${roomId}`, chatMessage);
  };

  return (
    <div className={'flex h-full flex-col items-center justify-center'}>
      {showCountDown ? (
        <CountDown />
      ) : showResult ? (
        <QuizResultComponent />
      ) : (
        <QuizComponent roomId={Number(roomId)} />
      )}
      <CharacterPreview />
      <ChattingBox onSend={handleSubmitMessage} messages={messages} />
      {!showChatBox ? <ChattingBoxBlind /> : null}
    </div>
  );
}
