import { categoryList, modeList } from '@/pages/lobby/constants';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';

export function RoomInfo() {
  const roomStore = useRoomStore();

  return (
    <div>
      {roomStore.roomInfo ? (
        <div className="inline-flex items-center rounded-2xl bg-white bg-opacity-70 p-2 px-5 text-2xl">
          <div>[{roomStore.roomInfo.title}]&nbsp;</div>
          <div>
            {Math.floor(roomStore.roomInfo.roomId / 1000)}
            &nbsp;채널&nbsp;|&nbsp;
          </div>
          <div>{roomStore.roomInfo.roomId}&nbsp;|&nbsp;</div>
          <div>{roomStore.roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</div>
          <div>{modeList[roomStore.roomInfo.gameMode]}&nbsp;|&nbsp;</div>
          <div>{roomStore.roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</div>
          <div>{categoryList[roomStore.roomInfo.category]}&nbsp;</div>
          {roomStore.roomInfo.gameMode == 'NORMAL' && (
            <div>|&nbsp;{roomStore.roomInfo.maxQuestion}&nbsp;문제</div>
          )}
        </div>
      ) : (
        <div>방 정보를 불러올 수 없습니다.</div>
      )}
    </div>
  );
}
