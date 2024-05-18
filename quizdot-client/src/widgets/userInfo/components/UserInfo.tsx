import { useEffect, useState } from 'react';
import { GetUserInfoApi } from '../api/api';
import type { UserInfo } from '../api/types';
import { Progress } from '@/shared/ui';

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
  if (userInfo) {
    return (
      <div className="m-2 flex p-2" style={{ width: '800px', height: '400px' }}>
        <div
          className="mr-4 flex flex-col items-center"
          style={{ width: '200px' }}
        >
          <div className="mt-2 rounded-lg border-2 bg-white p-2 shadow-md">
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: 'black',
              }}
            >
              <img src={`/images/${userInfo.characterId}.gif`} alt="" />
            </div>
          </div>
          <div
            className={
              'mt-2 flex-none rounded-lg border-2 bg-white px-6 text-center shadow-md'
            }
          >
            {userInfo.title}
          </div>
          <span className="mt-2">lv: {userInfo.level} </span>
          <span style={{ color: userInfo.nicknameColor }}>
            {userInfo.nickname}
          </span>
          <Progress
            size="w-40"
            color="yellow"
            label={`${userInfo.exp}/1000`}
            currentValue={userInfo.exp}
            maxValue={1000}
            padding="pt-[10px]"
          />
        </div>
        <div className="flex flex-col" style={{ width: '600px' }}>
          <div className="flex justify-around gap-0 rounded-tl-2xl rounded-tr-2xl border border-b-0 shadow-sm">
            <button
              className={`flex-grow rounded-none border hover:border-transparent focus:outline-none `}
            >
              유저 정보
            </button>
          </div>
          <div
            className="flex justify-around border p-2 shadow-md"
            style={{ height: '333px' }}
          >
            {/* 왼쪽 */}
            <div>
              <div>
                <p className="pt-6 text-xl">전체 게임 평균 승률</p>
                <p className="pl-2">{userInfo.totalRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="pt-6 text-xl">일반 게임 평균 승률 </p>
                <p className="pl-2">{userInfo.normalRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="pt-6 text-xl">서바이벌 평균 순위</p>
                <p className="pl-2"> {userInfo.survivalRate.toFixed(1)}%</p>
              </div>
            </div>
            {/* 오른쪽 */}
            <div>
              <div>
                <p className="pt-6 text-xl">전체 게임 우승</p>
                <p className="pl-2"> {userInfo.totalWinCount}회</p>
              </div>{' '}
              <div>
                <p className="pt-6 text-xl">일반 모드 우승</p>
                <p className="pl-2">{userInfo.normalWinCount}회</p>
              </div>{' '}
              <div>
                <p className="pt-6 text-xl">서바이벌 모드 우승</p>
                <p className="pl-2"> {userInfo.survivalWinCount}회</p>
              </div>
            </div>{' '}
          </div>
        </div>
      </div>
    );
  }
}
