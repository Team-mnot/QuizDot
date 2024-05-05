interface Response {
  status: number;
  message: string;
  data?: UserInfo;
  errors?: null;
}

interface UserInfo {
  id: number;
  totalRate: number;
  normalRate: number;
  survivalRate: number;
  nickname: string;
  nicknameColor: string;
  totalWinCount: number;
  normalWinCount: number;
  survivalWinCount: number;
  title: number;
  titleListDtos: TitleList[];
  characterId: number;
  characterListDtos: Character[];
  point: number;
}

interface TitleList {
  id: number;
  title: string;
  requirement: string;
  get: boolean;
}

interface Character {
  id: number;
  name: string;
}

export type { Response, UserInfo };
