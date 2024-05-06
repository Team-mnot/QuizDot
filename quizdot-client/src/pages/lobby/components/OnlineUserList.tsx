import { Modal } from '@/shared/ui';
import { OnlineUser } from './OnlineUser';
import { useOpenModal } from '@/shared/hooks';
import { useState } from 'react';

const myNickname = '어흥';

const dummyData = [
  {
    nickname: '어흥',
  },
  {
    nickname: '우엑',
  },
];

export function OnlineUserList() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <div className={'rounded-lg bg-white bg-opacity-20 p-5 shadow-md'}>
        {dummyData.map((item, index) => (
          <OnlineUser
            key={index}
            onClick={() => {
              setNickname(item.nickname);
              clickModal();
            }}
            nickname={item.nickname}
          />
        ))}
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        {myNickname == nickname ? <div>마이페이지</div> : <div>타인</div>}
      </Modal>
    </div>
  );
}
