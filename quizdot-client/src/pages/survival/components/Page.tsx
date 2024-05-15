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
import useRequestQuestion from '../hooks/useRequestQuestion';

export function SurvivalPage() {
  const { roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const location = useLocation();

  // const roomInfo = location.state.roomInfo; // state를 RoomInfoType으로 타입 캐스팅
  // const players = location.state.players;
  // 한방에 받아오기 ( 코드 있어보이게 )
  const { players: playersObj, roomInfo } = location.state || {
    players: {},
    roomInfo: {},
  };
  const players = Object.keys(playersObj).map((key) => playersObj[key]);

  const {
    showChatBox,
    showResult,
    setShowResult,
    setShowChatBox,
    setShowHint,
    setShowCountDown,
    showCountDown,
    setQuizzes,
    // quizzes,
  } = useQuizStore();

  const { requestQuestion } = useRequestQuestion();
  const { onSend, onSubscribe, callbackMsg } = useContext(WebSocketContext);
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);
  const userStore = useUserStore();
  const { category, gameMode } = roomInfo;

  // console.log('내아디', roomInfo.hostId);
  // console.log('방장아디', userStore.id);

  useEffect(() => {
    if (roomInfo.hostId === userStore.id) {
      requestQuestion(parseInt(roomId), category, 3, gameMode); // 방장만 호출하는rj
    }
  }, []);

  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/SurvivalBackground.png)';
    document.body.style.backgroundSize = 'cover';
    setShowCountDown(true);

    // TODO : Unscribe는?

    onSubscribe(`chat/game/${roomId}`);
    onSubscribe(`quiz/game/${roomId}`); // 퀴즈 받을 구독 주소 임니다
    onSubscribe(`info/game/${roomId}`); // 게임하는 동안 알림 받을 주소
  }, []);

  useEffect(() => {
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
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'STAGE_RESULT'
    ) {
      console.log('결과결과');
      console.log(callbackMsg.msg.data);
      // setShowResult(true);
      // setShowChatBox(true);
      // setShowHint(false);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'PASS'
    ) {
      console.log('패스다 패스!!');
      setShowResult(true);
      setShowChatBox(true);
      setShowHint(false);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `quiz/game/${roomId}` &&
      callbackMsg.msg.type == 'QUIZ'
    ) {
      setQuizzes(callbackMsg.msg.data);
    }
    // console.log(quizzes);
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
        <QuizResultComponent roomInfo={roomInfo} />
      ) : (
        <QuizComponent roomInfo={roomInfo} />
      )}
      <PlayerPreview players={players} />
      <ChattingBox onSend={handleSubmitMessage} messages={messages} />
      {!showChatBox ? <ChattingBoxBlind /> : null}
    </div>
  );
}
