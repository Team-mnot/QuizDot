import { CreatingRoomType, RoomInfoType } from '@/pages/lobby/api/types';

/*** 수정할 방 정보 타입 ***/
interface ModifyingRoomType extends CreatingRoomType {}

/*** 입장할 방 정보 타입 ***/
interface EnteringRoomType {
  players: PlayersType;
  roomInfo: RoomInfoType;
}

/*** 플레이어 정보 해시 타입 ***/
interface PlayersType {
  [id: number]: PlayerType;
}

/*** 플레이어 정보 타입 ***/
interface PlayerType {
  characterId: number;
  level: number;
  nickname: string;
  nicknameColor: string;
  title: string;
}

/*** 플레이어 점수 정보 해시 타입 ***/
interface ScoresType {
  [id: number]: number;
}

export type {
  ModifyingRoomType,
  EnteringRoomType,
  PlayerType,
  PlayersType,
  ScoresType,
};
