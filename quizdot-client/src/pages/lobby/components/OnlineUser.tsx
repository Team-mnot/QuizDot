import { ActiveUserType } from '../api/types';

export function OnlineUser({
  activeUser,
  handleClickUser,
}: {
  activeUser: ActiveUserType;
  handleClickUser: (userId: number) => void;
}) {
  return (
    <div className={'px-[20px] py-[10px]'}>
      <div
        className={'w-[200px] rounded-lg border-2 bg-white p-[10px] shadow-md'}
        onClick={() => handleClickUser(activeUser.id)}
      >
        <p>
          Lv.{activeUser.level}&nbsp;&nbsp;{activeUser.nickname}
        </p>
      </div>
    </div>
  );
}
