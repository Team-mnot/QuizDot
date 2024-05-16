import { PlayerList, RoomChattingBox } from '.';

export function RoomContent({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  // const playerKeys = Object.keys(temp.players);
  // const userStore = useUserStore();

  // 로딩 때문에 깜빡거리는 문제 해결하기
  // TODO: 이렇게 하면? 재렌더링 안될지도? 근데 새로고침 하면 필요 없을거 같기도

  return (
    <div className={'absolute left-[0px] top-[100px] w-full p-[30px]'}>
      <PlayerList roomId={roomId} />
      <RoomChattingBox roomId={roomId} channelId={channelId} />
    </div>
  );
}
