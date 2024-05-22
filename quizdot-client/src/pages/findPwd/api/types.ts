interface Response {
  status: number;
  message: string;
  data?: null;
  errors?: null;
}

interface FindPwdProps {
  memberId: string;
  hint: string;
}

export type { Response, FindPwdProps };
