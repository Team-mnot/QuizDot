import { Button, Progress } from '@/shared/ui';
import { RankType } from '../api/types';
import { useRouter } from '@/shared/hooks';
import { enterRoomApi } from '@/pages/waitingRoom/api/api';

export function Reward({
  ranks,
  roomId,
  channelId,
}: {
  ranks: RankType[];
  roomId: number;
  channelId: number;
}) {
  const router = useRouter();

  const handleEnterRoom = async (roomId: number) => {
    const response = await enterRoomApi(roomId);

    if (response.status == 200) {
      router.routeTo(`/${channelId}/${roomId}/waiting`);
    }
  };

  return (
    <div>
      <Button
        className="w-[100px]"
        value="대기실로 이동"
        onClick={() => handleEnterRoom(roomId)}
      />
      <div>
        <table>
          <tr className={'text-center'}>
            <td>
              <p>랭킹</p>
            </td>
            <td>
              <p>닉네임</p>
            </td>
            <td>
              <p>점수</p>
            </td>
            <td>
              <p>코인</p>
            </td>
            <td>
              <p>경험치</p>
            </td>
          </tr>

          {ranks &&
            ranks.map((rank) => (
              <tr className={'h-[50px] w-[500px] text-center'} key={rank.id}>
                <td>
                  <p>{rank.rank}</p>
                </td>
                <td>
                  <p>
                    Lv.{rank.curLevel} {rank.nickname}
                  </p>
                </td>
                <td>
                  <p>{rank.point}</p>
                </td>
                <td>
                  <p>{rank.point}</p>
                </td>
                <td>
                  <p>{rank.curExp}</p>
                </td>
                <td>
                  <Progress
                    color="yellow"
                    currentValue={5000}
                    maxValue={10000}
                    label={`${rank.curExp}/1000`}
                    padding=""
                    size="w-48"
                  />
                </td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
}
