import { RoomInfoType } from '../api/types';
import { roomStateColors } from '../constants';

export function Room({
  roomInfo,
  handleEnterRoom,
}: {
  roomInfo: RoomInfoType;
  handleEnterRoom: (roomId: number, isPublic: boolean) => void;
}) {
  return (
    <div className="px-[20px] py-[10px]">
      <div
        className={`h-[110px] w-[450px] rounded-lg border-2 bg-white p-[20px] shadow-md text-${roomStateColors[roomInfo.state]}`}
        onClick={() => handleEnterRoom(roomInfo.roomId, roomInfo.open)}
      >
        <div className="flex h-full">
          <div className="flex w-[100px] flex-col pr-[10px] text-left">
            <p className="flex-grow">{roomInfo.roomId}</p>
            <p className="flex-none">{roomInfo.category}</p>
          </div>
          <div className="flex w-[300px] flex-col pr-[10px] text-left">
            {roomInfo.title.length > 11 ? (
              <p className="flex-grow">
                {roomInfo.open ? '🎶' : '🔒'}&nbsp;
                {roomInfo.title.substr(0, 11)}&nbsp;.&nbsp;.&nbsp;.
              </p>
            ) : (
              <p className="flex-grow">
                {roomInfo.open ? '🎶' : '🔒'}&nbsp;
                {roomInfo.title}
              </p>
            )}
            <p className="flex-none">{roomInfo.maxQuestion}&nbsp;문제</p>
          </div>
          <div className="flex flex-col text-right">
            <p className="flex-grow">{roomInfo.gameMode}</p>
            <p className="flex-none">{roomInfo.maxPeople}&nbsp;인</p>
          </div>
        </div>
      </div>
    </div>
  );
}
