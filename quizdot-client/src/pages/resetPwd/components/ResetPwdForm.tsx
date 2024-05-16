import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResetPwdApi } from '../api/api';
import type { ResetPwdProps } from '../api/types';

// 유효성 조건
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// 스키마
const schema = z.object({
  password: z.string().regex(passwordRegex),
  passwordChk: z.string().regex(passwordRegex),
});

export function ResetPwdForm(props: { id: string }) {
  const navi = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const memberId = props.id;
  // 입력 확인용 변수
  const [password, setPassword] = useState<string>('');
  const [chkPassword, setChkPassword] = useState<string>('');
  // 비밀번호 표시 토글용 변수
  const [showPassword, setShowPassword] = useState(false);
  // 유효성 체크용 변수
  const [passwordValid, setPasswordValid] = useState(false);

  // 엔터로 바로 제출용
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 폼 제출 커스텀 핸들러
  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  // 폼 제출 함수
  const onSubmit: CustomSubmitHandler = async (data) => {
    const props: ResetPwdProps = {
      memberId: memberId as string,
      password: data.password as string,
      passwordChk: data.passwordChk as string,
    };

    const response = await ResetPwdApi(props);
    if (!response) {
      window.alert('비밀번호 재설정에 실패했습니다');
      return;
    } else {
      window.alert('비밀번호가 변경되었습니다');
      navi('/login');
    }
  };

  // 비밀번호 표시 토글 함수
  const togglePwdView = () => {
    setShowPassword(!showPassword);
  };

  // 비밀번호 입력
  const passwordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
  };

  // 비밀번호 확인 입력
  const chkPasswordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setChkPassword(inputValue);
    if (
      inputValue.length >= 8 &&
      passwordRegex.test(inputValue) &&
      password === inputValue
    ) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-1 mt-6 flex items-center">
        <div
          className="flex justify-center rounded-lg bg-white"
          style={{ height: '40px' }}
        >
          <input
            className="rounded-lg px-3 focus:outline-none"
            type={showPassword ? 'text' : 'password'}
            placeholder="새 비밀번호"
            {...register('password')}
            autoFocus
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
      <div className="text-center">
        {password.length < 8 || !passwordRegex.test(password) ? (
          <span className="text-red-400">
            비밀번호는 영어 + 숫자로 8~20자입니다
          </span>
        ) : (
          <span className="text-green-600">올바른 비밀번호 형식입니다</span>
        )}
      </div>
      {/* 비밀번호 확인 */}
      <div className="mb-1 mt-6 flex items-center">
        <div
          className="flex justify-center rounded-lg bg-white"
          style={{ height: '40px' }}
        >
          <input
            className="rounded-lg px-3 focus:outline-none"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            {...register('passwordChk')}
            value={chkPassword}
            onChange={chkPasswordChange}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitButtonRef.current?.focus();
                handleSubmit(onSubmit)();
              }
            }}
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
      <div className="text-center">
        {password !== '' && password !== chkPassword && chkPassword !== '' ? (
          <span className="text-red-500">비밀번호가 일치하지 않습니다</span>
        ) : (
          <span>&nbsp;</span>
        )}
        {password !== '' && password === chkPassword && (
          <span className="text-green-600">비밀번호가 일치합니다</span>
        )}
      </div>
      {/* 조건 전부 충족 되었을 때 제출 버튼 표시 */}
      {passwordValid ? (
        <button
          className="mt-6 w-full hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
          type="submit"
          ref={submitButtonRef}
        >
          비밀번호 재설정
        </button>
      ) : (
        <button className="mt-6 w-full hover:border-transparent focus:outline-none">
          새로운 비밀번호를 입력해주세요
        </button>
      )}
    </form>
  );
}
