import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogInApi } from '../api/api';
import { IdCheckAPi } from '@/pages/signUp/api/api';
import type { LogInProps } from '../api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';

// 유효성 조건
const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// 스키마
const schema = z.object({
  memberId: z.string().regex(idRegex),
  password: z.string().regex(passwordRegex),
});

export function LogInForm() {
  const store = useUserStore();
  const navi = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const [memberId, setMemberId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  const onSubmit: CustomSubmitHandler = async (data) => {
    const logInProps: LogInProps = {
      memberId: data.memberId as string,
      password: data.password as string,
    };
    const info = await LogInApi(logInProps);
    // 로그인 성공 시 유저 정보 로컬 스토리지에 저장
    if (info !== null) {
      store.getData(info);
      navi('/channel');
    }
  };

  // 비밀번호 표시 토글 함수
  const togglePwdView = () => {
    setShowPassword(!showPassword);
  };

  const idHandleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 추출
    const truncatedValue = alphanumericValue.slice(0, 20); // 최대 20자리까지만 유지
    setMemberId(truncatedValue);
  };

  // 비밀번호 입력
  const passwordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 추출
    const truncatedValue = alphanumericValue.slice(0, 20); // 최대 20자리까지만 유지
    setPassword(truncatedValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-1 rounded-lg bg-white p-2 px-3">
        <input
          className="focus:outline-none"
          type="text"
          placeholder="아이디"
          {...register('memberId')}
          minLength={4}
          maxLength={20}
          onChange={idHandleChange}
          value={memberId}
        />
      </div>
      <div className="mb-1 mt-6 flex items-center">
        <div
          className="flex justify-center rounded-lg bg-white"
          style={{ height: '40px' }}
        >
          <input
            className="rounded-lg px-3 focus:outline-none"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            {...register('password')}
            value={password}
            onChange={passwordChange}
          />
          <button
            className="bg-white px-3 hover:border-transparent focus:outline-none"
            type="button"
            onClick={togglePwdView}
            tabIndex={-1}
          >
            <img
              className="m-0 h-4 w-4 p-0 "
              src={`/images/${showPassword ? 'EyeClosed.png' : 'Eye.png'}`}
              alt=""
            />
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
      >
        Log In
      </button>
    </form>
  );
}
