import { useContext, useEffect } from 'react';
import { Character } from '@/shared/ui/Character';

import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { MessageDto } from '@/shared/apis/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';
import { Progress } from '@/shared/ui';

export function Players() {
  const roomStore = useRoomStore();
  const quizSetStore = useQuizSetStore();

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const callbackOfPlayers = async (message: MessageDto) => {
    console.log('PLAYERS: ', message);
    if (message.type == 'LEAVE') {
      roomStore.leavedPlayer(message.data);
    }
  };

  useEffect(() => {}, [quizSetStore]);

  useEffect(() => {
    onSubscribeWithCallBack(
      `players/room/${roomStore.roomInfo!.roomId}`,
      callbackOfPlayers,
    );

    return () => {
      onUnsubscribe(`players/room/${roomStore.roomInfo!.roomId}`);
    };
  }, [isReady]);

  const determineColor = (score: number | undefined): string => {
    const actualScore = score !== undefined ? score : 10;
    if (actualScore >= 7) {
      return 'lightgreen';
    } else if (actualScore >= 4) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  return (
    <div className="mt-[200px] flex w-full justify-between px-[200px]">
      {roomStore.players &&
        Object.entries(roomStore.players).map(([key, player]) => (
          <div
            key={key}
            className="m-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-50"
            style={{ width: '160px', height: '220px' }}
          >
            <Progress
              padding="pb-3"
              size="w-[160px]"
              color={determineColor(quizSetStore.scores[Number(key)])}
              label={
                quizSetStore.scores[Number(key)] !== undefined
                  ? `${quizSetStore.scores[Number(key)]}`
                  : '10'
              }
              currentValue={
                quizSetStore.scores[Number(key)] !== undefined
                  ? quizSetStore.scores[Number(key)]
                  : 10
              }
              maxValue={10}
            ></Progress>
            <Character
              title={player.title}
              nickname={player.nickname}
              nicknameColor={player.nicknameColor}
              level={player.level}
              characterId={player.characterId}
            />
          </div>
        ))}
    </div>
  );
}
