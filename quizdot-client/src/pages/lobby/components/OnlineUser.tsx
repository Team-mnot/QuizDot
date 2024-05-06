interface OnlineUserProps {
  nickname: string;
  onClick: () => void;
  key: number;
}

export function OnlineUser(props: OnlineUserProps) {
  return (
    <div className={'p-1'} onClick={props.onClick}>
      <div
        className={
          'w-[200px] rounded-lg border-2 bg-white p-2 text-center shadow-md'
        }
      >
        <p>{props.nickname}</p>
      </div>
    </div>
  );
}
