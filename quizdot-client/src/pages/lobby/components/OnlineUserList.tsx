import { Modal } from '@/shared/ui';
import { OnlineUser } from './OnlineUser';
import { useOpenModal } from '@/shared/hooks';
import { useState } from 'react';
import { ActiveUserDto } from '../api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';

export function OnlineUserList(props: { activeUserDtos: ActiveUserDto[] }) {
  const userStore = useUserStore();

  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [selectedId, setSelectedId] = useState(userStore.id);

  return (
    <div>
      <div className={'rounded-lg bg-white bg-opacity-20 p-5 shadow-md'}>
        {props.activeUserDtos.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              setSelectedId(user.id);
              clickModal();
            }}
          >
            <OnlineUser activeUserDto={user} />
          </div>
        ))}
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        {userStore.id == selectedId ? <div>마이페이지</div> : <div>타인</div>}
      </Modal>
    </div>
  );
}
