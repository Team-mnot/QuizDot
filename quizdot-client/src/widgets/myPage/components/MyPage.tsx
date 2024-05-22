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
  // 뭘 뽑았는지에 따라 다른 모달 띄우기 위한 변수
  const [getItem, setGetItem] = useState<string>('');
  const [getCha, setGetCha] = useState<number>(0);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selected, setSelected] = useState('Record');

  const [isBeforeCha, setIsBeforeCha] = useState<boolean>(false);
  const [isBeforeCol, setIsBeforeCol] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userinfo = await GetUserInfoApi(props.id);
        if (userinfo) {
          console.log(userinfo);
          setUserInfo(userinfo);
        }
      } catch (error) {
        console.error('Error Fetching UserInfo', error);
      }
    };
    fetchData();
  }, [getCha]);

  const handleGetCha = async () => {
    if (!isBeforeCha) {
      const confirmation = window.confirm(
        '10,000 포인트를 사용하여 캐릭터 뽑기를 하시겠습니까?\n뽑기에서 중복된 캐릭터가 나올 수 있습니다',
      );
      if (!confirmation) {
        return;
      } else {
        setIsBeforeCha(true);
      }
    }
    const cha = await GetCharacterApi();
    if (cha) {
      store.setPoint();
      setGetItem('cha');
      setGetCha(cha);
      clickUserModal();
    }
  };

  const handleGetCol = async () => {
    if (!isBeforeCol) {
      const confirmation = window.confirm(
        '10,000 포인트를 사용하여 닉네임 색상 뽑기를 하시겠습니까?\n색상은 완전히 무작위이며, 변경 시 이전의 색상은 사라집니다',
      );
      if (!confirmation) {
        return;
      } else {
        setIsBeforeCol(true);
      }
    }
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
    <div className="m-2 flex p-2" style={{ width: '800px', height: '400px' }}>
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
            <img src={`/images/${store.characterId}.gif`} alt="" />
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
        <button
          onClick={handleGetCol}
          className="mt-1 w-full shadow-md hover:border-transparent hover:bg-gray-200 focus:outline-none
          active:bg-gray-300"
        >
          닉네임 색상 뽑기
        </button>
        <button
          onClick={handleGetCha}
          className="mt-1 w-full shadow-md hover:border-transparent hover:bg-gray-200 focus:outline-none
          active:bg-gray-300"
        >
          캐릭터 뽑기
        </button>
      </div>
      {/* 오른쪽 */}
      <div className="flex flex-col" style={{ width: '600px' }}>
        <div className="flex justify-around gap-0 rounded-tl-2xl rounded-tr-2xl border border-b-0 shadow-sm">
          <button
            className={`flex-grow rounded-none rounded-tl-2xl hover:border-transparent focus:outline-none ${selected === 'Record' ? 'bg-gray-100 font-bold' : 'bg-white hover:bg-gray-100 active:bg-gray-300'}`}
            onClick={() => handleClick('Record')}
          >
            전적
          </button>
          <div className="border-l"></div>
          <button
            className={`flex-grow rounded-none border hover:border-transparent focus:outline-none ${selected === 'CharacterList' ? 'bg-gray-100 font-bold' : 'bg-white hover:bg-gray-100 active:bg-gray-300'}`}
            onClick={() => handleClick('CharacterList')}
          >
            캐릭터
          </button>
          <div className="border-l"></div>

          <button
            className={`flex-grow rounded-none hover:border-transparent focus:outline-none ${selected === 'TitleList' ? 'bg-gray-100 font-bold' : 'bg-white hover:bg-gray-100 active:bg-gray-300'}`}
            onClick={() => handleClick('TitleList')}
          >
            칭호
          </button>
          <div className="border-l"></div>

          <button
            className={`flex-grow rounded-none rounded-tr-2xl hover:border-transparent focus:outline-none ${selected === 'Settings' ? ' bg-gray-100 font-bold ' : 'bg-white hover:bg-gray-100 active:bg-gray-300'}`}
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
