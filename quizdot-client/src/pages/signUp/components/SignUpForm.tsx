import { useState, ChangeEvent, KeyboardEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignUpApi, IdCheckAPi, NicknameCheckAPi } from '../api/api';
import { LogInApi } from '@/pages/logIn/api/api';
import type { SignUpProps } from '../api/types';
import type { LogInProps } from '@/pages/logIn/api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';

// 유효성 조건
const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const hintRegex = /^[0-9]{6}$/;
const nicknameRegex = /^[A-Za-z0-9가-힣]{2,8}$/;

// 스키마
const schema = z.object({
  memberId: z.string().regex(idRegex),
  password: z.string().regex(passwordRegex),
  hint: z.string().regex(hintRegex),
  nickname: z.string().regex(nicknameRegex),
});

export function SignUpForm() {
  const store = useUserStore();
  const navi = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  // 입력 확인용 변수
  const [memberId, setMemberId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [chkPassword, setChkPassword] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  // 중복 확인용 변수
  const [checkId, setCheckId] = useState<boolean>(true);
  const [checkNickname, setCheckNickname] = useState<boolean>(true);
  // 비밀번호 표시 토글용 변수
  const [showPassword, setShowPassword] = useState(false);
  // 유효성 체크용 변수
  const [idValid, setIdValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [hintValid, setHintValid] = useState(false);
  const [nicknameValid, setNicknameValid] = useState(false);

  // 엔터로 바로 제출용
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 폼 제출 커스텀 핸들러
  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  // 폼 제출 함수
  const onSubmit: CustomSubmitHandler = async (data) => {
    try {
      const props: SignUpProps = {
        memberId: data.memberId as string,
        password: data.password as string,
        nickname: data.nickname as string,
        hint: data.hint as string,
      };
      const response = await SignUpApi(props);
      // 회원가입 성공 시 바로 로그인
      if (response === 'success') {
        const logInProps: LogInProps = {
          memberId: data.memberId as string,
          password: data.password as string,
        };
        const info = await LogInApi(logInProps);
        // 로그인 성공 시 유저 정보 조회 후 채널로 이동
        if (info !== null) {
          store.getData(info);
          navi('/channel');
        }
      }
    } catch (error) {
      console.error('Error Sign Up', error);
    }
  };

  // 비밀번호 표시 토글 함수
  const togglePwdView = () => {
    setShowPassword(!showPassword);
  };

  // 아이디 입력 및 중복 체크
  const idHandleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 추출
    const truncatedValue = alphanumericValue.slice(0, 20); // 최대 20자리까지만 유지
    setMemberId(truncatedValue);
    const response = await IdCheckAPi(truncatedValue);
    setCheckId(response);
    if (
      response &&
      truncatedValue.length >= 6 &&
      idRegex.test(truncatedValue)
    ) {
      setIdValid(true);
    } else {
      setIdValid(false);
    }
  };

  // 비밀번호 입력
  const passwordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 추출
    const truncatedValue = alphanumericValue.slice(0, 20); // 최대 20자리까지만 유지
    setPassword(truncatedValue);
  };

  // 비밀번호 확인 입력
  const chkPasswordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 추출
    const truncatedValue = alphanumericValue.slice(0, 20); // 최대 20자리까지만 유지
    setChkPassword(truncatedValue);
    if (
      truncatedValue.length >= 8 &&
      passwordRegex.test(truncatedValue) &&
      password === truncatedValue
    ) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  // 비밀번호 힌트 확인
  const hintHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // 숫자만 추출
    const truncatedValue = numericValue.slice(0, 6); // 최대 6자리까지만 유지
    setHint(truncatedValue);
    if (hintRegex.test(truncatedValue)) {
      setHintValid(true);
    } else {
      setHintValid(false);
    }
  };

  // 닉네임 확인
  const nicknameHandleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^\w가-힣]/g, ''); // 영어, 숫자, 한글만 추출
    const truncatedValue = alphanumericValue.slice(0, 8); // 최대 8자리까지만 유지
    setNickname(truncatedValue);
    const response = await NicknameCheckAPi(truncatedValue);
    setCheckNickname(response);
    if (nicknameRegex.test(truncatedValue)) {
      setNicknameValid(true);
    } else {
      setNicknameValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 아이디 */}
      <div className="mb-1 rounded-lg bg-white p-2 px-3">
        <input
          className="focus:outline-none"
          type="text"
          placeholder="아이디"
          {...register('memberId')}
          autoFocus
          minLength={4}
          maxLength={20}
          onChange={idHandleChange}
          value={memberId}
        />
      </div>
      <div className="text-center">
        {memberId.length < 6 || !idRegex.test(memberId) ? (
          <span className="text-red-400">
            아이디는 영어 + 숫자로 6~20자입니다
          </span>
        ) : null}
        {checkId === false && (
          <span className="text-red-500">이미 존재하는 아이디입니다</span>
        )}
        {memberId.length >= 6 && checkId && idRegex.test(memberId) ? (
          <span className="text-green-600">사용 가능한 아이디입니다</span>
        ) : null}
      </div>
      {/* 비밀번호 */}
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
            value={chkPassword}
            onChange={chkPasswordChange}
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
      {/* 비밀번호 힌트 */}
      <div className="mb-1 mt-6 rounded-lg bg-white p-2 px-3">
        <input
          className="focus:outline-none"
          type="text"
          placeholder="비밀번호 힌트"
          {...register('hint')}
          value={hint}
          onChange={hintHandleChange}
        />
      </div>
      <div className="text-center">
        {hint.length !== 6 || !/^\d+$/.test(hint) ? (
          <span className="text-red-400">힌트는 6자리의 숫자입니다</span>
        ) : (
          <span className="text-green-600">올바른 힌트 형식입니다</span>
        )}
      </div>
      {/* 닉네임 */}
      <div className="mb-1 mt-6 rounded-lg bg-white p-2 px-3">
        <input
          className="focus:outline-none"
          type="text"
          placeholder="닉네임"
          {...register('nickname')}
          minLength={2}
          maxLength={8}
          value={nickname}
          onChange={nicknameHandleChange}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitButtonRef.current?.focus();
              handleSubmit(onSubmit)();
            }
          }}
        />
      </div>
      <div className="text-center">
        {nickname.length < 2 && (
          <span className="text-red-400">닉네임은 2~8자입니다</span>
        )}
        {checkNickname === false && (
          <span className="text-red-500">이미 존재하는 닉네임입니다</span>
        )}
        {nickname.length >= 2 && checkNickname && (
          <span className="text-green-600">사용 가능한 닉네임입니다</span>
        )}
      </div>
      {/* 전부 유효 ? 회원가입 : ( 입력 안된 것 있음 ? 입력되지 않은 : 올바르지 않은) */}
      {idValid && passwordValid && hintValid && nicknameValid ? (
        <button
          type="submit"
          ref={submitButtonRef}
          className="mt-6 w-full hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
        >
          Sign Up
        </button>
      ) : memberId === '' ||
        password === '' ||
        chkPassword === '' ||
        hint === '' ||
        nickname === '' ? (
        <button className="mt-6 w-full bg-gray-200 hover:border-transparent focus:outline-none">
          입력되지 않은 항목이 있습니다
        </button>
      ) : (
        <button className="mt-6 w-full bg-gray-200 hover:border-transparent focus:outline-none">
          올바르지 않은 항목이 있습니다
        </button>
      )}
    </form>
  );
}
