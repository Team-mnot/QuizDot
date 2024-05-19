// src/pages/survival/components/Page.tsx

import { useEffect, useState, useContext } from 'react';
import { usePlayerStore, useQuizStore } from '../store';

import { PlayerPreview, predefinedPositions } from './PlayerPreview';
import { ChattingBox } from '@/shared/ui/ChattingBox';
import { ChattingBoxBlind } from '@/shared/ui/ChattingBoxBlind';
import { QuizComponent } from './QuizComponent';
import { QuizResultComponent } from './QuizResultComponent';
import { CountDown } from './CountDown';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { useParams, useLocation } from 'react-router-dom';
import useRequestQuestion from '../hooks/useRequestQuestion';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { GameOverComponent } from './GameOverComponent';

export function SurvivalPage() {
  const { roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const location = useLocation();
  const { players: playersObj, roomInfo } = location.state || {
    players: {},
    roomInfo: {},
  };

  const {
    showChatBox,
    showResult,
    setShowResult,
    setShowChatBox,
    setShowHint,
    setShowCountDown,
    showCountDown,
    setQuizzes,
    setIsGameOver,
    isGameOver,
    // quizzes,
  } = useQuizStore();

  const { setPlayers, updatePlayerStatus } = usePlayerStore();
  const { requestQuestion } = useRequestQuestion();
  const { onSend, onSubscribe, callbackMsg } = useContext(WebSocketContext);
  const [messages, setMessages] = useState<
    { nickname: string; content: string }[]
  >([]);
  const userStore = useUserStore();
  const { category, gameMode, hostId } = roomInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rewardData, setRewardData] = useState<any[]>([]);

  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/camping02.jpg)';
    document.body.style.backgroundSize = 'cover';
    setShowCountDown(true);

    onSubscribe(`chat/game/${roomId}`);
    onSubscribe(`quiz/game/${roomId}`); // 퀴즈 받을 구독 주소 임니다
    onSubscribe(`info/game/${roomId}`); // 게임하는 동안 알림 받을 주소
    onSubscribe(`players/room/${roomId}`); // 대기실 퇴장

    if (hostId === userStore.id) {
      requestQuestion(parseInt(roomId), category, 1, gameMode); // 방장만 호출하는거
    }

    const players = Object.keys(playersObj).map((key) => playersObj[key]);
    setPlayers(
      players.map((player, index) => ({
        ...player,
        position: predefinedPositions[index]?.position || { top: 0, left: 0 },
        isAlive: true,
        isRevive: false,
      })),
    );
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
      callbackMsg.msg.data.forEach(
        (result: { score: number; value: number }) => {
          updatePlayerStatus(result.value, result.score > 0);
        },
      );
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'RESURRECT'
    ) {
      // console.log('부활데이터');
      // console.log(callbackMsg.msg.data); // n명의 캐릭터가 부활했습니다!
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'REWARD'
    ) {
      setRewardData(callbackMsg.msg.data);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'LEAVE'
    ) {
      setRewardData(callbackMsg.msg.data);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'EXIT'
    ) {
      if (roomInfo.hostId === userStore.id) {
        jwtAxiosInstance
          .post(`/survival/exit/${roomInfo.roomId}`, {})
          .catch((error) => {
            console.error('Exit request failed:', error);
          });
      }
      setTimeout(() => {
        setIsGameOver(true);
      }, 4500);
    } else if (
      callbackMsg.msg &&
      callbackMsg.address == `info/game/${roomId}` &&
      callbackMsg.msg.type == 'PASS'
    ) {
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
    <div className={''}>
      {isGameOver ? (
        <GameOverComponent rewardData={rewardData} />
      ) : showCountDown ? (
        <CountDown />
      ) : showResult ? (
        <QuizResultComponent roomInfo={roomInfo} />
      ) : (
        <QuizComponent roomInfo={roomInfo} />
      )}
      <PlayerPreview />
      <ChattingBox onSend={handleSubmitMessage} messages={messages} />
      {!showChatBox ? <ChattingBoxBlind /> : null}
    </div>
  );
}
