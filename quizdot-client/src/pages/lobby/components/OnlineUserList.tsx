import { Modal } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { useState } from 'react';
import { ActiveUserType } from '../api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { OnlineUser } from '.';
import { MyPage } from '@/widgets/myPage';
import { UserInfo } from '@/widgets/userInfo';

export function OnlineUserList({
  activeUsers,
}: {
  activeUsers: ActiveUserType[];
}) {
  const userStore = useUserStore();

  const {
    isOpenModal: useOpenUserModal,
    clickModal: clickUserModal,
    closeModal: closeUserModal,
  } = useOpenModal();
  const [clickedUserId, setClickedUserId] = useState(userStore.id);

  const handleClickUser = (userId: number) => {
    setClickedUserId(userId);
    clickUserModal();
  };

  return (
    <div className="px-[30px] py-[10px]">
      <div
        className={
          'h-[520px] w-auto rounded-lg bg-white bg-opacity-60 shadow-md'
        }
      >
        <div className="p-[20px] text-center text-2xl">접속 중인 유저</div>
        <div className="custom-scrollbar mr-2 h-[430px] max-h-[430px] overflow-y-scroll">
          {activeUsers.map((user) => (
            <OnlineUser
              key={user.id}
              activeUser={user}
              handleClickUser={handleClickUser}
            />
          ))}
        </div>
      </div>

      <Modal isOpen={useOpenUserModal} onClose={closeUserModal}>
        {userStore.id == clickedUserId ? (
          <MyPage id={userStore.id} />
        ) : (
          <UserInfo id={clickedUserId} />
        )}
      </Modal>
    </div>
  );
}
