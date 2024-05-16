import { useEffect, useState } from 'react';
import type { UserInfo } from '../api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
// api
import { GetUserInfoApi } from '../api/api';
import { GetCharacterApi } from '../api/api';
import { GetColerApi } from '../api/api';
// 컴포넌트
import { Record } from './Record';
import { CharacterList } from './CharacterList';
import { TitleList } from './TitleList';
import { Settings } from './Settings';
// 모달
import { Modal, Progress } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { GetCharacter } from './GetCharacter';
import { GetColor } from './GetColor';

export function MyPage(props: { id: number }) {
  const store = useUserStore();

  // 모달
  const {
    isOpenModal: useOpenUserModal,
    clickModal: clickUserModal,
    closeModal: closeUserModal,
  } = useOpenModal();
  const [getItem, setGetItem] = useState<string>('');
  const [getCha, setGetCha] = useState<number>(0);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selected, setSelected] = useState('Record');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userinfo = await GetUserInfoApi(props.id);
        if (userinfo) {
          setUserInfo(userinfo);
        }
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken!);
        }
      } catch (error) {
        console.error('Error Fetching UserInfo', error);
      }
    };
    fetchData();
  }, []);

  const handleGetCha = async () => {
    const cha = await GetCharacterApi();
    if (cha) {
      store.setPoint();
      setGetItem('cha');
      setGetCha(cha);
      clickUserModal();
    }
  };

  const handleGetCol = async () => {
    const color = await GetColerApi();
    if (color) {
      store.setNicknameColor(color);
      store.setPoint();
      setGetItem('col');
      clickUserModal();
    }
  };

  const handleClick = (props: string) => {
    setSelected(props);
  };

  return (
    <div className="m-2 flex p-2" style={{ width: '600px', height: '400px' }}>
      {/* 왼쪽 */}
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
            {store.characterId}
          </div>
        </div>
        <div
          className={
            'mt-2 flex-none rounded-lg border-2 bg-white px-6 text-center shadow-md'
          }
        >
          <p>{store.title}</p>
        </div>
        <span className="mt-2">Lv. {userInfo?.level} </span>
        <span style={{ color: store.nicknameColor }}>{store.nickname}</span>
        <Progress
          size="w-40"
          color="yellow"
          label={`${store.exp}/1000`}
          currentValue={store.exp}
          maxValue={1000}
          padding="pt-[10px]"
        />
        <span className="mt-1">보유 코인: {store.point.toLocaleString()} </span>
        <button onClick={handleGetCol} className="mt-1 w-full shadow-md">
          닉네임 색상 뽑기
        </button>
        <button onClick={handleGetCha} className="mt-1 w-full shadow-md">
          캐릭터 뽑기
        </button>
      </div>
      {/* 오른쪽 */}
      <div className="flex flex-col" style={{ width: '400px' }}>
        <div className="flex justify-around gap-0">
          <button
            className={`flex-grow rounded-none rounded-tl-2xl hover:border-transparent focus:outline-none ${selected === 'Record' ? 'bg-blue-500 font-bold text-white' : 'hover:bg-gray-200 active:bg-gray-300'}`}
            onClick={() => handleClick('Record')}
          >
            전적
          </button>
          <button
            className={`flex-grow rounded-none hover:border-transparent focus:outline-none ${selected === 'CharacterList' ? 'bg-blue-500 font-bold text-white' : 'hover:bg-gray-200 active:bg-gray-300'}`}
            onClick={() => handleClick('CharacterList')}
          >
            캐릭터
          </button>
          <button
            className={`flex-grow rounded-none hover:border-transparent focus:outline-none ${selected === 'TitleList' ? 'bg-blue-500 font-bold text-white' : 'hover:bg-gray-200 active:bg-gray-300'}`}
            onClick={() => handleClick('TitleList')}
          >
            칭호
          </button>
          <button
            className={`flex-grow rounded-none rounded-tr-2xl hover:border-transparent focus:outline-none ${selected === 'Settings' ? 'bg-blue-500 font-bold text-white' : 'hover:bg-gray-200 active:bg-gray-300'}`}
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
              title={userInfo!.title}
              titleList={userInfo!.titleListDtos}
            />
          )}
          {selected === 'Settings' && <Settings />}
        </div>
      </div>
      <Modal isOpen={useOpenUserModal} onClose={closeUserModal}>
        {getItem === 'cha' ? (
          <GetCharacter character={getCha} />
        ) : (
          <GetColor color={store.nicknameColor} />
        )}
      </Modal>
    </div>
  );
}
