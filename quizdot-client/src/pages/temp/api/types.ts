import { CreatingRoomInfo, RoomInfoDto } from '@/pages/lobby/api/types';

interface TempResponse {
  status: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface ModifyingRoomInfo extends CreatingRoomInfo {}

interface EnteringRoomInfo {
  players: Players;
  roomInfo: RoomInfoDto;
}

interface Players {
  [key: string]: Player;
}

interface Player {
  level: number;
  nickname: string;
  nicknameColor: string;
  title: number;
  avatar: number;
}

export type { TempResponse, ModifyingRoomInfo, EnteringRoomInfo };
