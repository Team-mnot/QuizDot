import { Button, Modal } from '@/shared/ui';
import { useOpenModal, useRouter } from '@/shared/hooks';
import { useState } from 'react';
import { RoomInfoType } from '../api/types';
import { Room, RoomCreation, RoomPwd } from '.';

export function RoomList({
  roomInfos,
  channelId,
}: {
  roomInfos: RoomInfoType[];
  channelId: number;
}) {
  const {
    isOpenModal: isOpenCreationModal,
    clickModal: clickCreationModal,
    closeModal: closeCreationModal,
  } = useOpenModal();
  const {
    isOpenModal: isOpenPwdModal,
    clickModal: clickPwdModal,
    closeModal: closePwdModal,
  } = useOpenModal();

  const router = useRouter();
  const [clickedRoom, setClickedRoom] = useState<number>(-1);

  const handleEnterRoom = async (roomId: number, isPublic: boolean) => {
    if (isPublic) {
      // API 호출을 하고 난 후 입장할 것인가? (1 번, socket 으로 관리)
      // 입장한 후 API 호출을 할 것인가? (N 번, socket 으로 관리)
      // => 로비는 유동적이지만 방은 비교적 덜하므로 socket 으로도 충분하다고 판단됨
      router.routeTo(`/${channelId}/${roomId}/waiting`);
    } else {
      setClickedRoom(roomId);
      if (roomId != -1) clickPwdModal();
    }
  };

  return (
    <div className="px-[30px] py-[10px]">
      <div
        className={
          'h-[360px] w-[1100px] rounded-lg bg-white bg-opacity-20 shadow-md'
        }
      >
        <div className={'flex h-auto w-full justify-between p-[20px]'}>
          <div className={'flex w-[300px] justify-between pr-[20px] '}>
            <Button value="전체" />
            <Button value="일반" />
            <Button value="서바이벌" />
          </div>
          <div className={'flex w-[100px]'}>
            <Button value="방 생성" onClick={clickCreationModal} />
          </div>
        </div>
        <div className="scrollbar-hide h-[260px] max-h-[260px] w-full overflow-y-scroll">
          {roomInfos.map((room) => (
            <Room
              key={room.roomId}
              roomInfo={room}
              handleEnterRoom={handleEnterRoom}
            />
          ))}
        </div>

        <Modal isOpen={isOpenCreationModal} onClose={closeCreationModal}>
          <RoomCreation channelId={channelId} />
        </Modal>

        <Modal isOpen={isOpenPwdModal} onClose={closePwdModal}>
          <RoomPwd channelId={channelId} roomId={clickedRoom} />
        </Modal>
      </div>
    </div>
  );
}
