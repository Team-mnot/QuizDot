import { RoomInfoType } from '@/pages/lobby/api/types';
import { inviteRoomWithLinkApi } from '../api/api';
import { Button, Modal, Toast } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { useOpenModal } from '@/shared/hooks';
import { RoomModification } from './RoomModification';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { categoryList, modeList } from '@/pages/lobby/constants';

export function RoomInfo({ roomInfo }: { roomInfo: RoomInfoType }) {
  const [toastState, setToastState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [inviteLink, setInviteLink] = useState<string | null>(
    roomInfo.inviteLink,
  );

  const userStore = useUserStore();

  const {
    isOpenModal: isOpenModificationModal,
    clickModal: clickModificationModal,
    closeModal: closeModificationModal,
  } = useOpenModal();

  useEffect(() => {}, [inviteLink]);

  /*** 초대 링크 생성 ***/
  const inviteRoomWithLink = async () => {
    const response = await inviteRoomWithLinkApi(roomInfo.roomId);
    if (response.status == 200) {
      setInviteLink(response.data);
    } else {
      setToastMessage('초대 링크를 생성하지 못했어요!');
      setToastState(true);
    }
  };

  /*** 초대 링크를 클립 보드에 복사 ***/
  const copyClipBoard = async () => {
    try {
      if (!inviteLink) {
        setToastMessage('복사할 초대 링크가 없네요!');
        setToastState(true);
        return;
      }

      await navigator.clipboard.writeText(inviteLink);
      setToastMessage('클립 보드에 초대 링크가 복사되었어요!');
      setToastState(true);
    } catch (error) {
      console.log('[초대 링크 복사 실패]', error);

      setToastMessage('초대 링크를 복사하지 못했습니다...');
      setToastState(true);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="flex w-full items-center rounded-2xl bg-white bg-opacity-70 p-2 pl-5 text-2xl">
          <p>[{roomInfo.title}]&nbsp;</p>
          <p>
            {Math.floor(roomInfo.roomId / 1000)}
            &nbsp;채널&nbsp;|&nbsp;
          </p>
          <p>{roomInfo.roomId}&nbsp;|&nbsp;</p>
          <p>{roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
          <p>{modeList[roomInfo.gameMode]}&nbsp;|&nbsp;</p>
          <p>{roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
          <p>{categoryList[roomInfo.category]}&nbsp;</p>
          {roomInfo.gameMode == 'NORMAL' && (
            <p>|&nbsp;{roomInfo.maxQuestion}&nbsp;문제</p>
          )}
          {roomInfo.hostId == userStore.id && (
            <Button
              className="ml-2 bg-white bg-opacity-75 text-pink-600 hover:border-transparent hover:bg-slate-200 hover:text-pink-400 focus:outline-none"
              value="변경"
              onClick={clickModificationModal}
            />
          )}
        </div>
      </div>

      <div className="mt-2 flex  w-full items-center">
        <p>초대 코드&nbsp;:&nbsp;</p>
        {inviteLink ? (
          <div className="flex items-center">
            <p>
              {inviteLink.substr(39, 6)}
              &nbsp;.&nbsp;.&nbsp;.
            </p>
            <Button
              value="클립보드에 복사"
              className="ml-2 bg-white bg-opacity-75 text-pink-600 hover:border-transparent hover:bg-slate-200 hover:text-pink-400 focus:outline-none"
              onClick={copyClipBoard}
            />
          </div>
        ) : (
          <div className="flex items-center">
            <p>&nbsp;---&nbsp;</p>
            {roomInfo.hostId == userStore.id && (
              <Button
                value="초대 링크 생성"
                className="ml-1 bg-white bg-opacity-75 text-pink-600 hover:border-transparent hover:bg-slate-200 hover:text-pink-400 focus:outline-none"
                onClick={inviteRoomWithLink}
              />
            )}
          </div>
        )}
      </div>
      <Modal isOpen={isOpenModificationModal} onClose={closeModificationModal}>
        <RoomModification
          roomInfo={roomInfo}
          onClose={closeModificationModal}
        />
      </Modal>

      {toastState === true ? (
        <Toast message={toastMessage} setToastState={setToastState} />
      ) : null}
    </div>
  );
}
