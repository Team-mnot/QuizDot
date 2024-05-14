interface Response {
  status: number;
  message: string;
  data?: null;
  errors?: null;
}

interface ResetPwdProps {
  memberId: string;
  password: string;
  passwordChk: string;
}

export type { Response, ResetPwdProps };
