interface OnlineUserProps {
  nickname: string;
  onClick: () => void;
  key: number;
}

export function OnlineUser(props: OnlineUserProps) {
  return (
    <div className={'p-5'} onClick={props.onClick}>
      <div className={'rounded-md border-2 bg-white p-5 shadow-md'}>
        <p>{props.nickname}</p>
      </div>
    </div>
  );
}
