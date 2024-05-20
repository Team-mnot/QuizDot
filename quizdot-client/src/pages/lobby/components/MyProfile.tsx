import { useOpenModal } from '@/shared/hooks';
import { Modal, Progress } from '@/shared/ui';
import { MyPage } from '@/widgets/myPage';

import { useUserStore } from '@/shared/stores/userStore/userStore';

export function MyProfile() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

  const userStore = useUserStore();

  return (
    <div className="px-[30px] py-[10px] ">
      <div
        className="cursor-pointer rounded-lg hover:bg-gray-200 active:bg-gray-500"
        onClick={clickModal}
      >
        <div className="w-[370px] rounded-lg border-2 bg-white bg-opacity-90 p-[20px] shadow-md">
          <div className="flex justify-between">
            <div
              className="rounded-lg border-2 bg-white p-[10px]"
              style={{ height: '130px' }}
            >
              {/* 유저 캐릭터 */}
              <img
                src={`/images/${userStore.characterId}.gif`}
                alt=""
                className="h-[100px] w-[100px]"
              />
            </div>
            <div className="flex w-[200px] flex-col px-[10px]">
              <div
                className={
                  'flex-none rounded-lg border-2 bg-white text-center shadow-md'
                }
              >
                <p>{userStore.title}</p>
              </div>
              <div className="flex flex-col p-[10px]">
                <p>Lv.{userStore.level}&nbsp;&nbsp;</p>
                <p style={{ color: userStore.nicknameColor }}>
                  {userStore.nickname}
                </p>
              </div>
              <div className="flex flex-none pb-[10px] pl-[10px]">
                <img
                  src="/images/coin.png"
                  alt=""
                  className="h-[23px] w-[23px]"
                />
                <p className="pl-2">{userStore.point.toLocaleString()}</p>
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
