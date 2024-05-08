import { ActiveUserInfo } from '../api/types';

interface OnlineUserProps {
  activeUserInfo: ActiveUserInfo;
}
export function OnlineUser(props: OnlineUserProps) {
  return (
    <div className={'p-1'}>
      <div
        className={
          'w-[200px] rounded-lg border-2 bg-white p-2 text-center shadow-md'
        }
      >
        <p>{props.activeUserInfo.id}</p>
      </div>
    </div>
  );
}
