import { Button } from '@/shared/ui';
import { useEffect, useRef, useState, useContext } from 'react';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { baseApi } from '@/shared/apis';
import { useNavigate } from 'react-router-dom';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';

interface Props {
  roomId: number;
  category: string;
  visible: boolean;
}

export function SurvivalMatchBtn({ roomId, category, visible }: Props) {
  const { isReady, callbackMsg } = useContext(WebSocketContext);
  const [matchStatus, setMatchStatus] = useState<number>(0); // 0: 매칭 전, 1: 매칭 중, 2: 매칭 완료
  const [matchCount, setMatchCount] = useState<number>(0);
  const matchTimer = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(callbackMsg.msg.data);
    if (
      callbackMsg.msg &&
      callbackMsg.address == `chat/room/${roomId}` &&
      callbackMsg.msg.type == 'SURVIVAL'
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
      const response = await jwtAxiosInstance.post(
        `${baseApi}/survival/match/${roomId}/cancel?category=${category}`,
      );
      if (response.status === 200) {
        setMatchStatus(0);
        setMatchCount(0);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling match:', error);
    }
  };

  useEffect(() => {
    // 5 분 이상이 되면 자동 매칭 취소
    if (matchStatus === 1 && matchCount / 60 >= 5) {
      handleCancelGame();
    }
    return () => {
      if (matchCount === 1) {
        handleCancelGame;
      }
    };
  }, [matchCount, matchStatus]);

  return (
    <div>
      {matchStatus == 0 && visible && (
        <Button
          className="custom-pink custom-btn-transparent custom-text-outline-black custom-blinking text-[4em]"
          value="매칭 시작"
          onClick={handleMatchGame}
        />
      )}
      {matchStatus == 1 && visible && (
        <div>
          <p className="custom-black custom-btn-transparent custom-text-outline-black custom-blinking text-[4em]">
            매칭 중
          </p>
          <p className="rounded-2xl bg-white bg-opacity-70 text-2xl">
            {String(Math.floor(matchCount / 60)).padStart(2, '0')}:
            {String(matchCount % 60).padStart(2, '0')}
          </p>
        </div>
      )}
      {matchStatus == 1 && visible && (
        <div>
          <Button
            className="custom-pink custom-btn-transparent custom-text-outline-black"
            value="매칭 취소"
            onClick={handleCancelGame}
          />
        </div>
      )}
      {matchStatus == 2 && (
        <div>
          <p>매칭 완료</p>
          <p>
            {String(Math.floor(matchCount / 60)).padStart(2, '0')}:
            {String(matchCount % 60).padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  );
}
