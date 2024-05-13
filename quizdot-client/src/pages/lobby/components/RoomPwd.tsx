import { Button, Input } from '@/shared/ui';
import { useContext, useState } from 'react';
import { Toast } from '@/shared/ui/Toast';
import { useRouter } from '@/shared/hooks';
import { checkRoomPwdApi } from '../api/api';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function RoomPwd({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  const [password, setPassword] = useState<string>('');
  const [toastState, setToastState] = useState<boolean>(false);

  const { onUnsubscribe } = useContext(WebSocketContext);
  const router = useRouter();

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleCheckRoomPwd = async () => {
    const response = await checkRoomPwdApi(roomId, password);

    if (response == 200) {
      onUnsubscribe(`chat/lobby/${channelId}`);
      router.routeTo(`/${channelId}/${roomId}/waiting`);
    } else {
      setToastState(true);
    }
  };

  return (
    <div>
      <div className="px-[30px] py-[10px]">
        <p className="p-[10px]">비밀번호</p>
        <Input
          type="password"
          className="w-[130px]"
          value={password}
          onChange={changePassword}
        />
      </div>
      <div className="p-[30px]">
        <Button
          className="w-full"
          value="비밀번호 입력"
          onClick={handleCheckRoomPwd}
        />
      </div>

      {toastState === true ? (
        <Toast
          message={'방을 생성하지 못했습니다.'}
          setToastState={setToastState}
        />
      ) : null}
    </div>
  );
}
