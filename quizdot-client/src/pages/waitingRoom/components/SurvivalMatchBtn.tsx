import { Button } from '@/shared/ui';
import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { baseApi } from '@/shared/apis';
import { useNavigate } from 'react-router-dom';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';

interface Props {
  roomId: number;
  category: string;
}

export function SurvivalMatchBtn({ roomId, category }: Props) {
  // const matchStatus = useRef<number>(0);
  // const [matchCount, setMatchCount] = useState<number>(0);
  const { isReady, callbackMsg } = useContext(WebSocketContext);
  const [matchStatus, setMatchStatus] = useState<number>(0); // 0: 매칭 전, 1: 매칭 중, 2: 매칭 완료
  const [matchCount, setMatchCount] = useState<number>(0);
  const matchTimer = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      callbackMsg.msg &&
      callbackMsg.address == `chat/room/${roomId}` &&
      callbackMsg.msg.type == 'START'
    ) {
      matchTimer.current = null;
      setMatchStatus(2);
      const newRoomId = callbackMsg.msg.data.roomInfo.roomId; // 새로 생긴 roomId입니다..
      const channelId = Math.floor(newRoomId / 10000000); // 새로운 roomId 기반으로 channelId 계산
      navigate(`/${channelId}/${newRoomId}/survival`, {
        state: callbackMsg.msg.data,
      });
    }
  }, [callbackMsg]);

  const handleMatchGame = async () => {
    if (!isReady) return;
    try {
      const response = await jwtAxiosInstance.post(
        `${baseApi}/survival/match/${roomId}/enter?category=${category}`,
      );
      if (response.status === 200) {
        setMatchStatus(1);
        console.log(response.data.message);
        matchTimer.current = setInterval(() => {
          setMatchCount((prev) => {
            if (prev / 60 >= 5) {
              handleCancelGame();
            }
            return prev + 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting match:', error);
    }
  };

  const handleCancelGame = async () => {
    if (matchTimer.current) clearInterval(matchTimer.current);
    matchTimer.current = null;
    try {
      const response = await axios.post(
        `${baseApi}/survival/${roomId}/cancel?category=ECONOMY`,
      );
      if (response.status === 200) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling match:', error);
    }
    setMatchStatus(0);
    setMatchCount(0);
  };

  useEffect(() => {
    // 5 분 이상이 되면 자동 매칭 취소
    setMatchCount(0);
    if (matchCount / 60 == 5) handleCancelGame();
  }, []);

  return (
    <div>
      {matchStatus == 0 && (
        <Button
          className="w-[300px] text-5xl"
          value="매칭 시작"
          onClick={handleMatchGame}
        />
      )}
      {matchStatus == 1 && (
        <div>
          <Button
            className="w-[300px] text-5xl"
            value="매칭 취소"
            onClick={handleCancelGame}
          />
          <p>
            {String(matchCount / 60).padStart(2, '0')}:
            {String(matchCount % 60).padStart(2, '0')}
          </p>
        </div>
      )}
      {matchStatus == 2 && (
        <div>
          <Button
            className="w-[300px] text-5xl"
            value="매칭 완료"
            onClick={() => {}}
          />
          <p>
            {String(matchCount / 60).padStart(2, '0')}:
            {String(matchCount % 60).padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  );
}
