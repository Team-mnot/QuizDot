import { Button, Modal } from '@/shared/ui';
import { Room } from './Room';
import { useOpenModal } from '@/shared/hooks';
import { RoomCreation } from './RoomCreation';
import { RoomInfoDto } from '../api/types';

interface RoomListProps {
  roomInfoDtos: RoomInfoDto[];
  channelId: number;
}

export function RoomList(props: RoomListProps) {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

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
          <div key={room.roomId}>
            <Room roomInfoDto={room} />
          </div>
        ))}
      </div>
      <div>
        <Button value="<" />
        <Button value=">" />
        <Button value="방 생성" onClick={clickModal} />
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <RoomCreation channelId={props.channelId} />
      </Modal>
    </div>
  );
}
