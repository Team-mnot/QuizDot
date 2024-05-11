import { useEffect, useState } from 'react';
import { GetUserInfoApi } from '../api/api';
import type { UserInfo } from '../api/types';

export function UserInfo(props: { id: number }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userinfo = await GetUserInfoApi(props.id);
        if (userinfo) {
          setUserInfo(userinfo);
        }
      } catch (error) {
        console.error('Error Fetching UserInfo', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex border bg-slate-300">
      <div>
        <div>{userInfo?.characterId}</div>
        <span>{userInfo?.title}</span>
        <div>
          <span>lv: {userInfo?.level} </span>
          <span>{userInfo?.nickname}</span>
        </div>
        <span>{userInfo?.exp}</span>
      </div>
      <div>
        <p>게임 전적</p>
        <p>전체 게임 평균 순위{userInfo?.totalRate}</p>
        <p>일반 게임 평균 순위{userInfo?.normalRate}</p>
        <p>서바이벌 평균 순위{userInfo?.survivalRate}</p>
        <p>전체 게임 평균 승률{userInfo?.totalWinCount}</p>
        <p>일반 게임 평균 승률{userInfo?.normalWinCount}</p>
        <p>서바이벌 평균 승률{userInfo?.survivalWinCount}</p>
      </div>
    </div>
  );
}
