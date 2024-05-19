import { useContext, useEffect, useRef, useState } from 'react';
import { Character } from '@/shared/ui/Character';
import type { PlayersType } from '@/pages/waitingRoom/api/types';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { MessageDto } from '@/shared/apis/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';

export function Players() {
  const roomStore = useRoomStore();
  const userStore = useUserStore();
  const quizSetStore = useQuizSetStore();
  const playersCount = useRef<number>(Object.keys(roomStore.players).length);
  const [playerList, setPlayerList] = useState<PlayersType>();

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const callbackOfPlayers = async (message: MessageDto) => {
    console.log('PLAYERS: ', message);
    if (message.type == 'LEAVE') {
      roomStore.leavedPlayer(message.data);
    }
  };

  useEffect(() => {
    setPlayerList(roomStore.players);
    roomStore.enteredPlayer(userStore.id, {
      characterId: userStore.characterId,
      level: userStore.level,
      nickname: userStore.nickname,
      nicknameColor: userStore.nicknameColor,
      title: userStore.title,
    });
  }, []);

  useEffect(() => {
    onSubscribeWithCallBack(
      `players/room/${roomStore.roomInfo!.roomId}`,
      callbackOfPlayers,
    );

    return () => {
      onUnsubscribe(`players/room/${roomStore.roomInfo!.roomId}`);
    };
  }, [isReady]);

  return (
    <div className="flex justify-between">
      <div
        className="mt-[200px] flex flex-wrap"
        style={{ width: '400px', height: '500px' }}
      >
        {playerList &&
          Object.entries(roomStore.players)
            .slice(0, (playersCount.current + 1) / 2)
            .map(([key, player]) => (
              <div
                key={key}
                className="m-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-50"
                style={{ width: '160px', height: '220px' }}
              >
                <Character
                  title={player.title}
                  nickname={player.nickname}
                  nicknameColor={player.nicknameColor}
                  level={player.level}
                  characterId={player.characterId}
                />
                <p className="pb-2 text-xl">
                  point&nbsp;:&nbsp;
                  {quizSetStore.scores[Number(key)]
                    ? quizSetStore.scores[Number(key)]
                    : 0}
                </p>
              </div>
            ))}
      </div>
      <div
        className="mt-[200px] flex flex-wrap  pl-[40px]"
        style={{ width: '400px', height: '500px' }}
      >
        {playerList &&
          Object.entries(roomStore.players)
            .slice((playersCount.current + 1) / 2, playersCount.current)
            .map(([key, player]) => (
              <div
                key={key}
                className="m-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-50"
                style={{ width: '160px', height: '220px' }}
              >
                <Character
                  title={player.title}
                  nickname={player.nickname}
                  nicknameColor={player.nicknameColor}
                  level={player.level}
                  characterId={player.characterId}
                />
                <p className="pb-2 text-xl">
                  point&nbsp;:&nbsp;
                  {quizSetStore.scores[Number(key)]
                    ? quizSetStore.scores[Number(key)]
                    : 0}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
