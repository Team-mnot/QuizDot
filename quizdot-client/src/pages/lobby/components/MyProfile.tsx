import { useOpenModal } from '@/shared/hooks';
import { Modal, Progress } from '@/shared/ui';
import { MyPage } from '@/widgets/myPage';

import { useUserStore } from '@/shared/stores/userStore/userStore';

export function MyProfile() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

  const userStore = useUserStore();

  return (
    <div className="px-[30px] py-[10px]">
      <div onClick={clickModal}>
        <div className="w-[300px] rounded-lg border-2 bg-white p-[20px] shadow-md">
          <div className="flex justify-between">
            <div className="rounded-lg border-2 bg-white p-[10px]">
              <img
                src="/images/ikball.png"
                alt=""
                className="h-[100px] w-[100px]"
              />
            </div>
            <div className="flex w-[150px] flex-col px-[10px]">
              <div
                className={
                  'flex-none rounded-lg border-2 bg-white text-center shadow-md'
                }
              >
                <p>{userStore.title}</p>
              </div>
              <div className="flex flex-grow p-[10px]">
                <p>Lv.{userStore.level}&nbsp;&nbsp;</p>
                <p className={`text-[${userStore.nicknameColor}]`}>
                  {userStore.nickname}
                </p>
              </div>
              <div className="flex flex-none p-[10px]">
                <img
                  src="/images/ikball.png"
                  alt=""
                  className="h-[23px] w-[23px]"
                />
                <p className="pl-2">{userStore.point}</p>
              </div>
            </div>
          </div>
          <Progress
            size="w-full"
            color="yellow"
            label={`${userStore.exp}/1000`}
            currentValue={userStore.exp}
            maxValue={1000}
            padding="pt-[20px]"
          />
        </div>
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <MyPage id={userStore.id} />
      </Modal>
    </div>
  );
}
