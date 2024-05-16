import type { UserInfo } from '../api/types';

export function Record({ userInfo }: { userInfo: UserInfo }) {
  return (
    <div className="border p-2 shadow-md" style={{ height: '333px' }}>
      <p>전체 게임 평균 승률 : {userInfo?.totalRate.toFixed(1)}%</p>
      <p>일반 게임 평균 승률 : {userInfo?.normalRate.toFixed(1)}%</p>
      <p>서바이벌 평균 순위 : {userInfo?.survivalRate.toFixed(1)}%</p>
      <p>전체 게임 우승 : {userInfo?.totalWinCount}회</p>
      <p>일반 모드 우승 : {userInfo?.normalWinCount}회</p>
      <p>서바이벌 모드 우승 : {userInfo?.survivalWinCount}회</p>
    </div>
  );
}
