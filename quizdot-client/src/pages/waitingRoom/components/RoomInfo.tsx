import { RoomInfoType } from '@/pages/lobby/api/types';
import { inviteRoomWithLinkApi } from '../api/api';
import { Button, Modal, Toast } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { useOpenModal } from '@/shared/hooks';
import { RoomModification } from './RoomModification';
import { useUserStore } from '@/shared/stores/userStore/userStore';

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
    <div>
      <div className="flex w-[700px]">
        <p>[{roomInfo.title}]&nbsp;</p>
        <p>{roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
        <p>{roomInfo.gameMode}&nbsp;|&nbsp;</p>
        <p>{roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
        <p>{roomInfo.category}&nbsp;|&nbsp;</p>
        <p>{roomInfo.maxQuestion}&nbsp;문제</p>

        {roomInfo.hostId == userStore.id && (
          <Button
            className="text-[10px]"
            value="변경"
            onClick={clickModificationModal}
          />
        )}
      </div>

      <div className="flex w-[700px]">
        <p>초대 코드&nbsp;:&nbsp;</p>
        {inviteLink ? (
          <div className="flex">
            <p>
              {inviteLink.substr(39, 6)}
              &nbsp;.&nbsp;.&nbsp;.
            </p>
            <Button
              className="w-[70px] text-[10px]"
              value="복사"
              onClick={copyClipBoard}
            />
          </div>
        ) : (
          <div className="flex">
            <p>&nbsp;---&nbsp;</p>
            {roomInfo.hostId == userStore.id && (
              <Button
                value="초대 링크 생성"
                className="w-[110px] text-[10px] text-red-700"
                onClick={inviteRoomWithLink}
              />
            )}
          </div>
        )}
      </div>
      <Modal isOpen={isOpenModificationModal} onClose={closeModificationModal}>
        <RoomModification roomInfo={roomInfo} />
      </Modal>

      {toastState === true ? (
        <Toast message={toastMessage} setToastState={setToastState} />
      ) : null}
    </div>
  );
}
