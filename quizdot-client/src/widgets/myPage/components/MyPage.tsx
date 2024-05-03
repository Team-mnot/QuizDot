import { useEffect, useState } from 'react';
import { GetUserInfoApi } from '../api/api';
import type { UserInfo } from '../api/types';

import { Record } from './Record';
import { CharacterList } from './characterList';
import { TitleList } from './titleList';
import { Settings } from './settings';

export function MyPage(props: number) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userinfo = await GetUserInfoApi(props);
        console.log(userinfo);
        if (userinfo) {
          setUserInfo(userinfo);
        }
      } catch (error) {
        console.error('Error Fetching UserInfo', error);
      }
    };
    fetchData();
  }, []);

  // Todo: 레벨, 경험치 추가하기
  return (
    <div>
      <div>
        <div>{userInfo?.avartarId}</div>
        <span>{userInfo?.titleId}</span>
        {/* 레벨 */}
        <span>{userInfo?.nickname}</span>
        {/* 경험치=포인트? */}
        <span>보유 코인: </span>
        <button>닉네임 색상 뽑기</button>
        <button>캐릭터 뽑기</button>
      </div>
      <div>
        {/* Todo : 선택한 거 나오게 */}
        <Record />
        <CharacterList />
        <TitleList />
        <Settings />
      </div>
    </div>
  );
}
