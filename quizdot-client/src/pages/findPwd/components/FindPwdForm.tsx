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
  const { register, handleSubmit } = useForm({
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
      </div>
      <div>
        <label>비밀번호 힌트</label>
        <input type="text" {...register('hint')} />
      </div>
      <button type="submit">비밀번호 찾기</button>
    </form>
  );
}
