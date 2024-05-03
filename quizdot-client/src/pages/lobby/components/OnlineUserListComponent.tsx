import { Modal } from '@/shared/ui';
import { OnlineUserComponent } from './OnlineUserComponent';
import { useOpenModal } from '@/shared/hooks';
import { useState } from 'react';

const dummyData = [
  {
    nickname: '어흥',
  },
];

export function OnlineUserListComponent() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <div>
        {dummyData.map((item, index) => (
          <OnlineUserComponent
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
        <div className={'h-96 w-96'}>{nickname}</div>
      </Modal>
    </div>
  );
}
