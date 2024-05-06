import { useEffect, useState } from 'react';
import { GetUserInfoApi } from '../api/api';
import type { UserInfo } from '../api/types';

import { Record } from './Record';
import { CharacterList } from './characterList';
import { TitleList } from './titleList';
import { Settings } from './settings';

export function MyPage(props: { id: number }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selected, setSelected] = useState('Record');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userinfo = await GetUserInfoApi(props.id);
        if (userinfo) {
          setUserInfo(userinfo);
          console.log(userInfo);
        }
      } catch (error) {
        console.error('Error Fetching UserInfo', error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (props: string) => {
    setSelected(props);
  };
  if (userInfo) {
    return (
      <div className="m-2 flex border bg-slate-400 p-2">
        {/* 왼쪽 */}
        <div className="flex flex-col">
          <div>{userInfo.characterId}</div>
          <span>{userInfo.title}</span>
          <div>
            <span>lv: {userInfo.level} </span>
            <span>{userInfo.nickname}</span>
          </div>
          <span>경험치 : {userInfo.exp}</span>
          <span>보유 코인: {userInfo.point} </span>
          <button>닉네임 색상 뽑기</button>
          <button>캐릭터 뽑기</button>
        </div>
        {/* 오른쪽 */}
        <div className="flex flex-col">
          <div>
            <button
              className={`${selected === 'Record' ? 'bg-blue-500 font-bold text-white' : ''}`}
              onClick={() => handleClick('Record')}
            >
              전적
            </button>
            <button
              className={`${selected === 'CharacterList' ? 'bg-blue-500 font-bold text-white' : ''}`}
              onClick={() => handleClick('CharacterList')}
            >
              캐릭터
            </button>
            <button
              className={`${selected === 'TitleList' ? 'bg-blue-500 font-bold text-white' : ''}`}
              onClick={() => handleClick('TitleList')}
            >
              칭호
            </button>
            <button
              className={`${selected === 'Settings' ? 'bg-blue-500 font-bold text-white' : ''}`}
              onClick={() => handleClick('Settings')}
            >
              설정
            </button>
          </div>
          <div>
            {selected === 'Record' && <Record userInfo={userInfo!} />}
            {selected === 'CharacterList' && (
              <CharacterList
                characterId={userInfo!.characterId}
                characterList={userInfo!.characterListDtos}
              />
            )}
            {selected === 'TitleList' && (
              <TitleList
                title={userInfo.title}
                titleList={userInfo.titleListDtos}
              />
            )}
            {selected === 'Settings' && <Settings />}
          </div>
        </div>
      </div>
    );
  }
}
