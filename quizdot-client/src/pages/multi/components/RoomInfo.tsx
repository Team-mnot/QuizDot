import { useGameStore } from '@/shared/stores/connectionStore/gameStore';

export function RoomInfo({ channelId }: { channelId: number }) {
  const gameStore = useGameStore();

  return (
    <div>
      {gameStore.roomInfo ? (
        <div className="flex w-[700px]">
          <p>
            {channelId}&nbsp;채널&nbsp;[{gameStore.roomInfo.title}]&nbsp;
          </p>
          <p>{gameStore.roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
          <p>{gameStore.roomInfo.gameMode}&nbsp;|&nbsp;</p>
          <p>{gameStore.roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
          <p>{gameStore.roomInfo.category}&nbsp;|&nbsp;</p>
          <p>{gameStore.roomInfo.maxQuestion}&nbsp;문제</p>
        </div>
      ) : (
        <div>방 정보를 불러올 수 없습니다.</div>
      )}
    </div>
  );
}
