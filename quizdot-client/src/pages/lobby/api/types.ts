interface LobbyResponse {
  status: number;
  message: string;
  data: LobbyInfo;
}

interface LobbyInfo {
  channelId: number;
  activeUsersInfo: ActiveUserInfo[];
  roomsInfo: RoomInfo[];
}

interface ActiveUserInfo {
  id: number;
  level: number;
  nickname: string;
}

interface RoomInfo {
  roomId: number;
  title: string;
  password: string;
  gameMode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
  hostId: number;
  public: boolean;
}

interface CreatingRoomInfo {
  title: string;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
  public: boolean;
}

interface CreatedRoomInfo {
  channelId: number;
  hostId: number;
  roomInfo: RoomInfo[];
}

interface PrivateRoomInfo {
  roomNum: number;
  password: string;
}

export type {
  LobbyResponse,
  LobbyInfo,
  ActiveUserInfo,
  RoomInfo,
  CreatingRoomInfo,
  CreatedRoomInfo,
  PrivateRoomInfo,
};
