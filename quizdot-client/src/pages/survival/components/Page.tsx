// src/pages/survival/components/Page.tsx

import { useEffect, useState, useRef } from 'react';
import { fetchQuizData } from '../api/api';
import useQuizStore from '../store';

import { CharacterPreview } from './CharacterPreview';
// import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBoxBlind } from '@/shared/ui/ChattingBoxBlind';
import { QuizComponent } from './QuizComponent';
import { QuizResultComponent } from './QuizResultComponent';
import { CountDown } from './CountDown';
import { SocketStore } from '@/shared/stores/connectionStore/socket';
import { IMessage } from '@stomp/stompjs';

interface MessageDto {
  sender: string;
  text: string;
  type: string;
  data: unknown;
}

export function SurvivalPage() {
  const {
    showChatBox,
    showResult,
    setShowResult,
    setShowCountDown,
    showCountDown,
    setQuizzes,
    roomId,
    setRoomId,
  } = useQuizStore();

  const stompInstance = useRef(new SocketStore());
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);

  // 여기서 설정..하는건 아니겠지만~?
  // const roomId = 8001;
  const category = 'RANDOM';
  const count = 2;

  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/SurvivalBackground.png)';
    document.body.style.backgroundSize = 'cover';

    setRoomId(8001);
    setShowCountDown(true);
    const loadData = async () => {
      try {
        const data = await fetchQuizData(roomId, category, count);
        setQuizzes(data.data.quizResList);
      } catch (error) {
        console.log('에러발생', error);
      }
    };

    const onCallBack = async (message: IMessage) => {
      const msg: MessageDto = JSON.parse(message.body) as MessageDto;
      console.error('[콜백 성공] server -> client ', msg);

      switch (msg.type) {
        case 'CHAT':
          setMessages((messages) => [
            ...messages,
            { nickname: msg.sender, content: msg.text },
          ]);
          break;

        // 모두 제출 했다면? 다음문제로 가야하는데 ?
        case 'PASS':
          setShowResult(true);
          break;

        default:
          // 기본적인 처리
          break;
      }
    };
    stompInstance.current.onConnect(`chat/game/${roomId}`, onCallBack);

    // 생각해보니까 이건 대기실 API잖아 ..
    // stompInstance.current.onSubscribe(`info/game/${roomId}`, onCallBack);
    // stompInstance.current.onSubscribe(`players/game/${roomId}`, onCallBack);

    loadData();

    // 언마운트 될 때 ~ ?
    return () => {
      stompInstance.current.onDisconnect();
    };
  }, []);

  const onSend = (message: string) => {
    const chatMessage = {
      sender: '익',
      text: message,
      type: 'CHAT',
      data: null,
    };

    stompInstance.current.onSend(`game/${roomId}`, chatMessage);
  };

  return (
    <div className={'flex h-full flex-col items-center justify-center'}>
      {showCountDown ? (
        <CountDown />
      ) : showResult ? (
        <QuizResultComponent />
      ) : (
        <QuizComponent roomId={roomId} />
      )}
      <CharacterPreview />
      <ChattingBox onSend={onSend} messages={messages} />
      {!showChatBox ? <ChattingBoxBlind /> : null}
    </div>
  );
}
