import { Button, Input } from '@/shared/ui';
import { useState } from 'react';
import { Toast } from '@/shared/ui/Toast';
import { useRouter } from '@/shared/hooks';
import { checkRoomPwdApi } from '../api/api';

interface RoomPwdProps {
  roomId: number;
  channelId: number;
}

export function RoomPwd(props: RoomPwdProps) {
  const [password, setPassword] = useState<string>('');

  const [toastState, setToastState] = useState(false);

  const router = useRouter();

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const checkRoomPwd = async () => {
    const response = await checkRoomPwdApi(props.roomId, password);

    if (response == 200) {
      router.routeTo(`/${props.channelId}/${props.roomId}/temp`);
    } else {
      setToastState(true);
    }
  };

  return (
    <div>
      <div>
        <p className={'p-2'}>비밀번호</p>
        <Input
          type="password"
          className="w-[200px]"
          value={password}
          onChange={changePassword}
        />
      </div>
      <div className={'px-10 py-10'}>
        <Button
          className={'w-full'}
          value="비밀번호 입력"
          onClick={checkRoomPwd}
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
