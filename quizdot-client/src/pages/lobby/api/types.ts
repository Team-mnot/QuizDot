/*** 로비 API 반환 타입 ***/
interface LobbyResponse {
  status: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/*** 로비 정보 타입 ***/
interface LobbyInfoType {
  channelId: number;
  activeUsers: ActiveUserType[];
  roomInfos: RoomInfoType[];
}

/*** 접속한 유저 정보 타입 ***/
interface ActiveUserType {
  id: number;
  level: number;
  nickname: string;
}

/*** 방 정보 타입 ***/
interface RoomInfoType {
  roomId: number;
  title: string;
  password: string;
  open: boolean;
  gameMode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
  hostId: number;
  inviteLink: string | null;
  state: string;
}

/*** 생성할 방 정보 타입 ***/
interface CreatingRoomType {
  title: string;
  open: boolean;
  password: string;
  mode: string;
  category: string;
  maxPeople: number;
  maxQuestion: number;
}

/*** 생성된 방 정보 타입 ***/
interface CreatedRoomType {
  channelId: number;
  hostId: number;
  roomInfo: RoomInfoType[];
}

/*** 비공개 방 비밀번호 확인 시 타입 ***/
interface RoomPwdType {
  roomNum: number;
  password: string;
}

export type {
  LobbyResponse,
  LobbyInfoType,
  ActiveUserType,
  RoomInfoType,
  CreatingRoomType,
  CreatedRoomType,
  RoomPwdType,
};
