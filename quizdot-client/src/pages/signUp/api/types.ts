interface Response {
  status: number;
  message: string;
  data?: null;
  errors?: null;
}

interface SignUpProps {
  memberId: string;
  password: string;
  nickname: string;
  hint: string;
}

export type { Response, SignUpProps };
