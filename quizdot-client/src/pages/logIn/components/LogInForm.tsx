import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogInApi } from '../api/api';
import type { LogInProps } from '../api/types';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const schema = z.object({
  memberId: z.string().min(8).max(20),
  password: z
    .string()
    .regex(
      passwordRegex,
      '비밀번호는 8자 이상이며 하나 이상의 문자와 숫자를 각자 포함해야 합니다',
    ),
});

export function LogInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  const onSubmit: CustomSubmitHandler = (data) => {
    const formData: LogInProps = {
      memberId: data.memberId as string,
      password: data.password as string,
    };
    LogInApi(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>아이디</label>
        <input type="text" {...register('memberId')} />
        {errors.memberId && <span>잘못된 아이디 형식입니다</span>}
      </div>
      <div>
        <label>비밀번호</label>
        <input type="password" {...register('password')} />
        {errors.password && <span>잘못된 비밀번호 형식입니다</span>}
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}
