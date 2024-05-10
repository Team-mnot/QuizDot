import { Button, Modal } from '@/shared/ui';
import { Room } from './Room';
import { useOpenModal, useRouter } from '@/shared/hooks';
import { RoomCreation } from './RoomCreation';
import { RoomInfoDto } from '../api/types';
import { RoomPwd } from './RoomPwd';
import { useState } from 'react';

export function RoomList(props: {
  roomInfoDtos: RoomInfoDto[];
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

  const clickRoom = async (roomId: number, isPublic: boolean) => {
    if (isPublic) {
      router.routeTo(`/${props.channelId}/${roomId}/waiting`);
    } else {
      setClickedRoom(roomId);
      if (roomId == -1) return;
      else clickPwdModal();
    }
  };

  return (
    <div>
      <div>
        <Button value="전체" />
        <Button value="일반" />
        <Button value="서바이벌" />

        <Button value="이전" />
      </div>
      <div className={'rounded-lg bg-white bg-opacity-20 p-5 shadow-md'}>
        {props.roomInfoDtos.map((room) => (
          <div
            key={room.roomId}
            onClick={() => {
              clickRoom(room.roomId, room.open);
            }}
          >
            <Room roomInfoDto={room} />
          </div>
        ))}
      </div>
      <div>
        <Button value="<" />
        <Button value=">" />
        <Button value="방 생성" onClick={clickCreationModal} />
      </div>

      <Modal isOpen={isOpenCreationModal} onClose={closeCreationModal}>
        <RoomCreation channelId={props.channelId} />
      </Modal>

      <Modal isOpen={isOpenPwdModal} onClose={closePwdModal}>
        <RoomPwd channelId={props.channelId} roomId={clickedRoom} />
      </Modal>
    </div>
  );
}
