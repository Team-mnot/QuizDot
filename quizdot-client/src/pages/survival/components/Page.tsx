// src/pages/survival/components/Page.tsx

import { useEffect, useState, useContext } from 'react';
import useQuizStore from '../store';

import { PlayerPreview } from './PlayerPreview';
// import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBoxBlind } from '@/shared/ui/ChattingBoxBlind';
import { QuizComponent } from './QuizComponent';
import { QuizResultComponent } from './QuizResultComponent';
import { CountDown } from './CountDown';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { useParams, useLocation } from 'react-router-dom';
import useIsSubmitAnswer from '../hooks/useIsSubmitAnswer';

export function SurvivalPage() {
  const { roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const location = useLocation();

  // const roomInfo = location.state.roomInfo; // state를 RoomInfoType으로 타입 캐스팅
  // const players = location.state.players;
  // 한방에 받아오기 ( 코드 있어보이게 )
  const { players, roomInfo } = location.state || { players: [], roomInfo: {} };

  const {
    showChatBox,
    showResult,
    setShowResult,
    setShowChatBox,
    setShowHint,
    setShowCountDown,
    showCountDown,
    setQuizzes,
  } = useQuizStore();

  const { submitAnswer } = useIsSubmitAnswer();
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

    if (
      callbackMsg.msg &&
      callbackMsg.address == `chat/game/${roomId}` &&
      callbackMsg.msg.type == 'CHAT'
    ) {
      setMessages((messages) => [
        ...messages,
        { nickname: callbackMsg.msg.sender, content: callbackMsg.msg.text },
      ]);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `quiz/game/${roomId}` &&
      callbackMsg.msg.type == 'PASS'
    ) {
      if (roomInfo.hostId === userStore.id) {
        submitAnswer(parseInt(roomId)); // 방장만 호출하는 정답제출 함수
      }
      setShowResult(true);
      setShowChatBox(true);
      setShowHint(false);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `quiz/game/${roomId}` &&
      callbackMsg.msg.type == 'QUIZ'
    ) {
      setQuizzes(callbackMsg.msg.data.quizResList);
    }
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
      <PlayerPreview players={players} />
      <ChattingBox onSend={handleSubmitMessage} messages={messages} />
      {!showChatBox ? <ChattingBoxBlind /> : null}
    </div>
  );
}
