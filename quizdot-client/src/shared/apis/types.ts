interface Response {
  status: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface MessageDto {
  sender: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: any;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface RoomInfoType {
  roomId: number;
  title: string | null;
  open: boolean;
  password: string | null;
  gameMode: string | null;
  maxPeople: number;
  category: string;
  maxQuestion: number;
  hostId: number;
  state: string | null;
  inviteLink: string | null;
}

interface PlayerType {
  level: number;
  nickname: string;
  nicknameColor: string;
  title: string;
  characterId: number;
}

export type { Response, MessageDto, RoomInfoType, PlayerType };
