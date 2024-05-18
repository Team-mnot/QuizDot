import { Button, Modal } from '@/shared/ui';
import { useOpenModal, useRouter } from '@/shared/hooks';
import { useState, useEffect } from 'react';
import { RoomInfoType } from '../api/types';
import { Room, RoomCreation, RoomPwd } from '.';
import { enterRoomApi } from '@/pages/waitingRoom/api/api';
import { enterLobbyApi } from '../api/api';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';

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

  useEffect(() => {
    setRoomInfo(roomInfos);
  }, []);

  const roomStore = useRoomStore();
  const router = useRouter();
  const [clickedRoom, setClickedRoom] = useState<number>(-1);
  const [roomInfo, setRoomInfo] = useState<RoomInfoType[]>([]);
  // 새로고침
  const handleRefresh = async (channelId: number) => {
    const response = await enterLobbyApi(channelId);
    setRoomInfo(response.roomInfos);
  };

  // 모드 필터
  const [selectedMode, setSelectedMode] = useState('전체');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const filteredRooms = roomInfo.filter((room) => {
    if (selectedMode === '전체') {
      return true;
    } else {
      return room.gameMode === selectedMode;
    }
  });
  const currentRooms = filteredRooms
    .sort((a, b) => a.roomId - b.roomId)
    .slice(indexOfFirstRoom, indexOfLastRoom);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEnterRoom = async (roomId: number, isPublic: boolean) => {
    if (isPublic) {
      const response = await enterRoomApi(roomId);

      if (response.status == 200) {
        roomStore.reset();
        roomStore.fetchRoom(response.data.roomInfo);
        roomStore.fetchPlayers(response.data.players);
        router.routeTo(`/${channelId}/${roomId}/waiting`);
      }
    } else {
      setClickedRoom(roomId);
      if (roomId != -1) clickPwdModal();
    }
  };

  return (
    <div className="px-[30px] py-[10px] pr-[200px]">
      <div className="h-[480px] w-[1000px] rounded-lg bg-white bg-opacity-50 shadow-md">
        <div className="flex h-auto w-full justify-between p-[20px]">
          <div className="flex w-[400px] justify-between pr-[20px] ">
            <Button value="전체" onClick={() => setSelectedMode('전체')} />
            <Button value="일반" onClick={() => setSelectedMode('NORMAL')} />
            <Button
              value="서바이벌"
              onClick={() => setSelectedMode('SURVIVAL')}
            />
            <Button value="일기토" onClick={() => setSelectedMode('ILGITO')} />
          </div>
          <div className="mr-3 flex w-[210px] justify-between">
            <Button value="새로고침" onClick={() => handleRefresh(channelId)} />
            <Button value="방 생성" onClick={clickCreationModal} />
          </div>
        </div>
        <div className=" h-[380px] max-h-[380px] w-full">
          <div className="grid grid-cols-2 ">
            {currentRooms.map((room) => (
              <Room
                key={room.roomId}
                roomInfo={room}
                handleEnterRoom={handleEnterRoom}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          {Array.from(
            { length: Math.ceil(filteredRooms.length / roomsPerPage) },
            (_, i) => (
              <Button
                key={i}
                value={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              />
            ),
          )}
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
