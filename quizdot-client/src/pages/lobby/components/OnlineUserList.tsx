import { Button, Modal } from '@/shared/ui';
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
          'h-[360px] w-auto rounded-lg bg-white bg-opacity-20 shadow-md'
        }
      >
        <div className="p-[20px] text-center">
          <Button value="접속 유저 리스트" />
        </div>
        <div className="scrollbar-hide h-[260px] max-h-[260px] overflow-y-scroll">
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
