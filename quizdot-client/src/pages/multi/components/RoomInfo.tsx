import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';

export function RoomInfo({ channelId }: { channelId: number }) {
  const roomStore = useRoomStore();

  return (
    <div>
      {roomStore.roomInfo ? (
        <div className="flex w-[700px]">
          <p>
            {channelId}&nbsp;채널&nbsp;[{roomStore.roomInfo.title}]&nbsp;
          </p>
          <p>{roomStore.roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
          <p>{roomStore.roomInfo.gameMode}&nbsp;|&nbsp;</p>
          <p>{roomStore.roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
          <p>{roomStore.roomInfo.category}&nbsp;|&nbsp;</p>
          <p>{roomStore.roomInfo.maxQuestion}&nbsp;문제</p>
        </div>
      ) : (
        <div>방 정보를 불러올 수 없습니다.</div>
      )}
    </div>
  );
}
