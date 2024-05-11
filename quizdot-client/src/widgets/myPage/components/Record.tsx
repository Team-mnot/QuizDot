import type { UserInfo } from '../api/types';

export function Record({ userInfo }: { userInfo: UserInfo }) {
  return (
    <div className="border bg-slate-100">
      <p>전체 게임 평균 순위{userInfo?.totalRate}</p>
      <p>일반 게임 평균 순위{userInfo?.normalRate}</p>
      <p>서바이벌 평균 순위{userInfo?.survivalRate}</p>
      <p>전체 게임 평균 승률{userInfo?.totalWinCount}</p>
      <p>일반 게임 평균 승률{userInfo?.normalWinCount}</p>
      <p>서바이벌 평균 승률{userInfo?.survivalWinCount}</p>
    </div>
  );
}
