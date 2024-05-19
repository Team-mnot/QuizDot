import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogInApi } from '../api/api';
import { IdCheckApi } from '@/pages/signUp/api/api';
import type { LogInProps } from '../api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

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

  const { isReady, onConnect } = useContext(WebSocketContext);

  const [memberId, setMemberId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [idValid, setIdValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  // 엔터로 바로 제출용
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 폼 제출 커스텀 핸들러
  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  // 폼 제출 함수
  const onSubmit: CustomSubmitHandler = async (data) => {
    // 존재하지 않는 아이디일 때
    const response = await IdCheckApi(memberId);
    if (response) {
      window.alert('존재하지 않는 아이디입니다');
      setMemberId('');
      setPassword('');
      return;
    }
    const logInProps: LogInProps = {
      memberId: data.memberId as string,
      password: data.password as string,
    };
    const info = await LogInApi(logInProps);
    // 로그인 성공 시 유저 정보 로컬 스토리지에 저장, 소켓 연결, 채널로 이동
    if (info !== null) {
      store.getData(info);
      if (isReady) onConnect();
      navi('/channel');
    } else {
      window.alert('비밀번호가 일치하지 않습니다');
    }
    setMemberId('');
    setPassword('');
  };

  // 비밀번호 표시 토글 함수
  const togglePwdView = () => {
    setShowPassword(!showPassword);
  };

  const idHandleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMemberId(inputValue);
    if (inputValue.length >= 6 && idRegex.test(inputValue)) {
      setIdValid(true);
    } else {
      setIdValid(false);
    }
  };

  // 비밀번호 입력
  const passwordChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
    if (inputValue.length >= 8 && passwordRegex.test(inputValue)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  // 유효성 체크 및 해당하는 오류 알림
  const onValidChk = () => {
    if (memberId === '') {
      window.alert('아이디를 입력해주세요');
      return;
    }
    if (!idValid) {
      window.alert('올바르지 않은 아이디 형식입니다');
      return;
    }
    if (password === '') {
      window.alert('비밀번호를 입력해주세요');
      return;
    }
    if (!passwordValid) {
      window.alert('올바르지 않은 비밀번호 형식입니다');
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-2 px-3 mb-1 bg-white rounded-lg">
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
      <div className="flex items-center mt-6 mb-1">
        <div
          className="flex justify-center bg-white rounded-lg"
          style={{ height: '40px' }}
        >
          <input
            className="px-3 rounded-lg focus:outline-none"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            {...register('password')}
            value={password}
            onChange={passwordChange}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitButtonRef.current?.focus();
                handleSubmit(onSubmit)();
              }
            }}
          />
          <button
            className="px-3 bg-white hover:border-transparent focus:outline-none"
            type="button"
            onClick={togglePwdView}
            tabIndex={-1}
          >
            <img
              className="w-4 h-4 p-0 m-0 "
              src={`/images/${showPassword ? 'EyeClosed.png' : 'Eye.png'}`}
              alt=""
            />
          </button>
        </div>
      </div>
      {idValid && passwordValid ? (
        <button
          type="submit"
          ref={submitButtonRef}
          className="w-full mt-6 hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
        >
          Log In
        </button>
      ) : (
        <button
          onClick={onValidChk}
          className="w-full mt-6 hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
        >
          Log In
        </button>
      )}
    </form>
  );
}
