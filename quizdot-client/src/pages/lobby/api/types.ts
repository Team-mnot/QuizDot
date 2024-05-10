interface LobbyResponse {
  status: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface LobbyInfo {
  channelId: number;
  activeUserDtos: ActiveUserDto[];
  roomInfoDtos: RoomInfoDto[];
}

interface ActiveUserDto {
  id: number;
  level: number;
  nickname: string;
}

interface RoomInfoDto {
  roomId: number;
  title: string;
  password: string;
  gameMode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
  hostId: number;
  isPublic: boolean;
}

interface CreatingRoomInfo {
  title: string;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
  isPublic: boolean;
}

interface CreatedRoomInfo {
  channelId: number;
  hostId: number;
  roomInfo: RoomInfoDto[];
}

interface CheckRoomPwdInfo {
  roomNum: number;
  password: string;
}

interface RoomIdInfo {
  roomId: number;
}

export type {
  LobbyResponse,
  LobbyInfo,
  ActiveUserDto,
  RoomInfoDto,
  CreatingRoomInfo,
  CreatedRoomInfo,
  CheckRoomPwdInfo,
  RoomIdInfo,
};
