import { CharacterProps } from '../api/types';

export function CharacterComponent(props: CharacterProps) {
  return (
    <div>
      <img src={props.imageUrl} alt={props.nickname} className="h-28" />
      <p className={''}>{props.title}</p>
      <p className={'text-red-700'}>{props.nickname}</p>
      <p className={''}>{props.score}</p>
    </div>
  );
}
