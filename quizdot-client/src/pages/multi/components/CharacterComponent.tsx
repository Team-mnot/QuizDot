import { CharacterProps } from '../api/types';

interface CharacterPropsWithSize extends CharacterProps {
  margin: string;
  size: string;
}

export function CharacterComponent(props: CharacterPropsWithSize) {
  return (
    <div>
      <img
        src={props.imageUrl}
        alt={props.nickname}
        className={`${props.margin} ${props.size}`}
      />
      <p className={''}>{props.title}</p>
      <p className={'text-red-700'}>{props.nickname}</p>
      <p className={''}>{props.score}</p>
    </div>
  );
}
