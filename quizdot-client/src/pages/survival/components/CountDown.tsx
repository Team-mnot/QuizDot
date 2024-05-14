// src/pages/survival/components/CountDown.tsx

import { useContext, useEffect, useState } from 'react';
import useQuizStore from '../store';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { StageResultComponent } from './StageResultComponent';
import { GameOverComponent } from './GameOverComponent';

export function CountDown() {
  const [count, setCount] = useState(3); // 카운트다운 시간 설정
  const { setShowCountDown } = useQuizStore();

  const [resultType, setResultType] = useState('');
  const [resultData, setResultData] = useState([]);
  const { callbackMsg } = useContext(WebSocketContext);

  useEffect(() => {
    if (callbackMsg.msg && callbackMsg.msg.type) {
      setResultType(callbackMsg.msg.type);
      setResultData(callbackMsg.msg.data);
    }
  }, [callbackMsg]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) {
          return prevCount - 1;
        } else {
          clearInterval(timer);
          setShowCountDown(false); // 카운트다운 상태를 false로 설정
          return prevCount;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setShowCountDown]);

  if (resultType === 'STAGE_RESULT') {
    return <StageResultComponent resultData={resultData} />;
  }

  if (resultType === 'EXIT') {
    return <GameOverComponent resultData={resultData} />;
  }

  return (
    <div className="fixed left-0 right-0 top-10 mx-auto max-w-3xl">
      <div className="flex justify-center">
        <h1>{count}초 뒤 퀴즈 </h1>
      </div>
    </div>
  );
}
