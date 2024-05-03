import { RoomInfoProps } from '../api/types';

interface RoomProps extends RoomInfoProps {
  onClick: () => void;
  key: number;
}

export function RoomComponent(props: RoomProps) {
  return (
    <div className="p-5" onClick={props.onClick}>
      <div className={'rounded-md border-2 bg-white p-5 shadow-md'}>
        <div className="flex justify-between">
          <p>{props.id}</p>
          <p>
            ({props.public ? '공개' : '비공개'}) {props.title}
          </p>
          <p>{props.mode}</p>
        </div>
        <div className="flex justify-between">
          <p>{props.category}</p>
          <p>{props.maxQuestion}</p>
          <p>{props.maxPeople}</p>
        </div>
      </div>
    </div>
  );
}
