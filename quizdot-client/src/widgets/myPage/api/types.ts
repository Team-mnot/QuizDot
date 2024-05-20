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
  otoRate: number;
  otoWinCount: number;
  title: number;
  titleListDtos: Title[];
  characterId: number;
  characterListDtos: Character[];
  level: number;
  exp: number;
  point: number;
}

interface Title {
  id: number;
  title: string;
  requirement: string;
  get: boolean;
}

interface Character {
  id: number;
  name: string;
}

interface ChangePwdProps {
  password: string;
  chkPassword: string;
}

export type { Response, UserInfo, ChangePwdProps, Character, Title };
