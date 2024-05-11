import { CreatingRoomType, RoomInfoType } from '@/pages/lobby/api/types';

/*** 게임 대기실 API 반환 타입 ***/
interface WaitingRoomResponse {
  status: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/*** 수정할 방 정보 타입 ***/
interface ModifyingRoomType extends CreatingRoomType {}

/*** 입장할 방 정보 타입 ***/
interface EnteringRoomType {
  players: PlayersType;
  roomInfo: RoomInfoType;
}

/*** 플레이어 정보 해시 타입 ***/
interface PlayersType {
  [key: string]: PlayerType;
}

/*** 플레이어 정보 타입 ***/
interface PlayerType {
  characterId: number;
  level: number;
  nickname: string;
  nicknameColor: string;
  title: string;
}

export type {
  WaitingRoomResponse,
  ModifyingRoomType,
  EnteringRoomType,
  PlayerType,
};
