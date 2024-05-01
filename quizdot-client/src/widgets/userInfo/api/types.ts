interface Response {
  status: number;
  message: string;
  data?: UserInfo;
  errors?: null;
}

// Todo: 레벨, 경험치 추가하기
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

export type { Response, UserInfo };
