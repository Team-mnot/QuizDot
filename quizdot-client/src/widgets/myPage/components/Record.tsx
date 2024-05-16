import type { UserInfo } from '../api/types';

export function Record({ userInfo }: { userInfo: UserInfo }) {
  return (
    <div
      className="flex justify-around border p-2 shadow-md"
      style={{ height: '333px' }}
    >
      {/* 왼쪽 */}
      <div>
        <div>
          <p className="pt-6 text-xl">전체 게임 평균 승률</p>
          <p className="pl-2">{userInfo?.totalRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="pt-6 text-xl">일반 게임 평균 승률 </p>
          <p className="pl-2">{userInfo?.normalRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="pt-6 text-xl">서바이벌 평균 순위</p>
          <p className="pl-2"> {userInfo?.survivalRate.toFixed(1)}%</p>
        </div>
      </div>
      {/* 오른쪽 */}
      <div>
        <div>
          <p className="pt-6 text-xl">전체 게임 우승</p>
          <p className="pl-2"> {userInfo?.totalWinCount}회</p>
        </div>{' '}
        <div>
          <p className="pt-6 text-xl">일반 모드 우승</p>
          <p className="pl-2">{userInfo?.normalWinCount}회</p>
        </div>{' '}
        <div>
          <p className="pt-6 text-xl">서바이벌 모드 우승</p>
          <p className="pl-2"> {userInfo?.survivalWinCount}회</p>
        </div>
      </div>
    </div>
  );
}
