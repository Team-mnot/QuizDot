interface Response {
  status: number;
  message: string;
  data: UserInfo;
}

interface UserInfo {
  id: number;
  title: string;
  nickname: string;
  nicknameColor: string;
  characterId: number;
  level: number;
  exp: number;
  point: number;
}

interface LogInProps {
  memberId: string;
  password: string;
}

export type { Response, LogInProps, UserInfo };
