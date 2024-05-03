import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FindPwdApi } from '../api/api';
import type { FindPwdProps } from '../api/types';

const schema = z.object({
  memberId: z.string().min(8).max(20),
  hint: z.string().min(6).max(6),
});

export function FindPwdForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  const onSubmit: CustomSubmitHandler = (data) => {
    const props: FindPwdProps = {
      memberId: data.memberId as string,
      hint: data.hint as string,
    };
    FindPwdApi(props);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>아이디</label>
        <input type="text" {...register('memberId')} />
        {errors.memberId && <span>잘못된 아이디 형식입니다</span>}
      </div>
      <div>
        <label>비밀번호 힌트</label>
        <input type="text" {...register('hint')} />
        {errors.hint && <span>힌트는 당신의 생년월일 6자리입니다</span>}
      </div>
      <button type="submit">비밀번호 찾기</button>
    </form>
  );
}
