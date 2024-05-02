import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignUpApi } from '../api/api';
import type { SignUpProps } from '../api/types';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const schema = z.object({
  memberId: z.string().min(4).max(20),
  password: z
    .string()
    .regex(
      passwordRegex,
      '비밀번호는 8자 이상이며 하나 이상의 문자와 숫자를 각자 포함해야 합니다',
    ),
  nickname: z.string().min(2).max(8),
  // ToDo : 힌트 어떻게 줄 지 정리해서 수정
  hint: z.string().min(6).max(6),
});

export function SignUpForm() {
  const navi = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  const onSubmit: CustomSubmitHandler = async (data) => {
    try {
      const props: SignUpProps = {
        memberId: data.memberId as string,
        password: data.password as string,
        nickname: data.nickname as string,
        hint: data.hint as string,
      };
      await SignUpApi(props);
      navi('/login');
      // Todo: 회원 가입 후 자동 로그인
    } catch (error) {
      console.error('Error signup:', error);
    }
  };

  // Todo : 하나 입력할 때마다 확인
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>아이디</label>
        <input type="text" {...register('memberId')} />
        {errors.memberId && <span>아이디는 4자~20자만 가능합니다</span>}
      </div>
      <div>
        <label>비밀번호</label>
        <input type="password" {...register('password')} />
        {errors.password && (
          <span>
            비밀번호는 8자 이상이며 하나 이상의 문자와 숫자를 각자 포함해야
            합니다
          </span>
        )}
      </div>
      <div>
        <label>닉네임</label>
        <input type="text" {...register('nickname')} />
        {errors.nickname && <span>닉네임은 2~8자만 가능합니다</span>}
      </div>
      <div>
        <label>비밀번호 힌트</label>
        <input type="text" {...register('hint')} />
        {/* check */}
        {errors.password && <span>힌트는 6자여야 합니다</span>}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}
