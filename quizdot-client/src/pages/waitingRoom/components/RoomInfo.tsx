import { RoomInfoDto } from '@/pages/lobby/api/types';
import { InviteRoomWithLinkApi } from '../api/api';
import { Button, Modal, Toast } from '@/shared/ui';
import { useState } from 'react';
import { useOpenModal } from '@/shared/hooks';
import { RoomModification } from './RoomModification';
// import { useUserStore } from '@/shared/stores/userStore/userStore';

export function RoomInfo(props: { roomInfo: RoomInfoDto; channelId: number }) {
  const [toastState, setToastState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  // const userStore = useUserStore();

  const {
    isOpenModal: isOpenModificationModal,
    clickModal: clickModificationModal,
    closeModal: closeModificationModal,
  } = useOpenModal();

  /*** 초대 링크 생성 ***/
  const inviteRoomWithLink = async () => {
    const response = await InviteRoomWithLinkApi(props.roomInfo.roomId);
    if (response.status == 200) {
      props.roomInfo.inviteLink = response.data;
    } else {
      setToastMessage('초대 링크를 생성하지 못했어요!');
      setToastState(true);
    }
  };

  /*** 초대 링크를 클립 보드에 복사 ***/
  const copyClipBoard = async () => {
    try {
      if (!props.roomInfo.inviteLink) {
        setToastMessage('복사할 링크가 없네요!');
        setToastState(true);
        return;
      }

      await navigator.clipboard.writeText(props.roomInfo.inviteLink);
      setToastMessage('클립 보드에 링크가 복사되었어요!');
      setToastState(true);
    } catch (error) {
      console.log('[링크 복사 실패]', error);

      setToastMessage('링크를 복사하지 못했습니다...');
      setToastState(true);
    }
  };

  return (
    <div>
      <div className="flex">
        <p>[{props.roomInfo.title}]&nbsp;</p>
        <p>{props.roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.gameMode}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.category}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.maxQuestion}&nbsp;문제</p>
        <Button
          className="text-xs"
          value="변경"
          onClick={clickModificationModal}
        />
      </div>
      <div className="flex">
        <p>초대 코드&nbsp;:&nbsp;</p>
        {props.roomInfo.inviteLink ? (
          <div className="flex">
            <p>
              {props.roomInfo.inviteLink.substr(39, 6)}
              &nbsp;.&nbsp;.&nbsp;.
            </p>
            <Button className="text-xs" value="복사" onClick={copyClipBoard} />
          </div>
        ) : (
          <Button
            value="초대 코드 생성"
            className="text-red-700"
            onClick={() => {
              inviteRoomWithLink();
              // if (props.roomInfo.hostId == userStore.id) inviteRoomWithLink();
              // else setToastState(true);
            }}
          />
        )}
      </div>
      <div className="flex">
        <p>인원 수&nbsp;:&nbsp;</p>
        <p>{}</p>
      </div>
      <Modal isOpen={isOpenModificationModal} onClose={closeModificationModal}>
        <RoomModification
          roomInfo={props.roomInfo}
          channelId={props.channelId}
        />
      </Modal>

      {toastState === true ? (
        <Toast message={toastMessage} setToastState={setToastState} />
      ) : null}
    </div>
  );
}
