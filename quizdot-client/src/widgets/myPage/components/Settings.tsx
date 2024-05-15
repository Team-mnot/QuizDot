import { useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChangeNicknameApi, ChangePwdApi } from '../api/api';
import { NicknameCheckAPi } from '@/pages/signUp/api/api';
import type { ChangePwdProps } from '../api/types';

export function Settings() {
  // 유효성 조건
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const nicknameRegex = /^[A-Za-z0-9가-힣]{2,8}$/;

  // 유효성 체크
  const nicknameSchema = z.object({
    nickname: z.string().regex(nicknameRegex),
  });

  const pwdSchema = z.object({
    password: z.string().regex(passwordRegex),
    chkPassword: z.string().regex(passwordRegex),
  });

  const { register: registerPwd, handleSubmit: handleSubmitPwd } = useForm({
    resolver: zodResolver(pwdSchema),
  });

  const { register: registerNickname, handleSubmit: handleSubmitNickname } =
    useForm({
      resolver: zodResolver(nicknameSchema),
    });

  // 입력 확인용 변수
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState('');
  const [chkPassword, setChkPassword] = useState('');
  // 중복 확인용 변수
  const [checkNickname, setCheckNickname] = useState<boolean>(true);
  // 유효성 체크용 변수
  const [nicknameValid, setNicknameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  // 비밀번호 표시 토글용 변수
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 표시 토글 함수
  const togglePwdView = () => {
    setShowPassword(!showPassword);
  };

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  // 닉네임 변경 제출
  const NicknameSubmit: CustomSubmitHandler = async (data) => {
    const { nickname } = data;
    await ChangeNicknameApi(nickname);
  };

  // 비밀번호 변경 제출
  const PwdSubmit: CustomSubmitHandler = async (data) => {
    const changePwdProps: ChangePwdProps = {
      password: data.memberId as string,
      chkPassword: data.password as string,
    };
    await ChangePwdApi(changePwdProps);
  };

  // 새 비밀번호 입력
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
    <div>
      {/* 지우기 */}
      {/* 
      
      지 우 기
      
      */}
      <div>
        {checkNickname}
        {nicknameValid}
        {passwordValid}
      </div>
      <form onSubmit={handleSubmitNickname(NicknameSubmit)}>
        <div className="mb-1 mt-6 rounded-lg bg-white p-2 px-3">
          <input
            className="focus:outline-none"
            type="text"
            placeholder="닉네임"
            {...registerNickname('nickname')}
            minLength={2}
            maxLength={8}
            value={nickname}
            onChange={nicknameHandleChange}
          />
          <button
            className="bg-white px-3 hover:border-transparent focus:outline-none"
            type="submit"
          >
            변경
          </button>
        </div>
      </form>
      <form onSubmit={handleSubmitPwd(PwdSubmit)}>
        <div className="mb-1 mt-6 flex items-center">
          <div
            className="flex justify-center rounded-lg bg-white"
            style={{ height: '40px' }}
          >
            <input
              className="rounded-lg px-3 focus:outline-none"
              type={showPassword ? 'text' : 'password'}
              placeholder="새 비밀번호"
              {...registerPwd('password')}
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
              {...registerPwd('passwordChk')}
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
        <button type="submit">비밀번호 변경</button>
      </form>
    </div>
  );
}
