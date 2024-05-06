interface Response {
  status: number;
  message: string;
  data?: UserInfo;
  errors?: null;
}

interface UserInfo {
  id: number;
  normalRate: number;
  survivalRate: number;
  nickname: string;
  nicknameColor: string;
  normalWinCount: number;
  survivalWinCount: number;
  titleId: number;
  avartarId: number;
  point: number;
}

interface ChangePwdProps {
  password: string;
  chkPassword: string;
}

export type { Response, UserInfo, ChangePwdProps };
