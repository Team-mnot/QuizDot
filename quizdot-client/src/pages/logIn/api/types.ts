interface Response {
  status: number;
  message: string;
}

interface LogInProps {
  memberId: string;
  password: string;
}

export type { Response, LogInProps };
