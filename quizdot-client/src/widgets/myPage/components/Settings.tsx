import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChangeNicknameApi, ChangePwdApi, CheckPwdApi } from '../api/api';
import type { ChangePwdProps } from '../api/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { WithdrawalButton } from '@/shared/components/WithDrawalButton';

export function Settings() {
  const store = useUserStore();
  // 유효성 조건
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const nicknameRegex = /^[A-Za-z0-9가-힣]{2,8}$/;

  // 유효성 체크
  const nicknameSchema = z.object({
    nickname: z.string().regex(nicknameRegex),
  });

  const pwdSchema = z.object({
    CurPwd: z.string().regex(passwordRegex),
    NewPwd: z.string().regex(passwordRegex),
    chkPwd: z.string().regex(passwordRegex),
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
  const [currentPwd, setCurrentPwd] = useState('');
  const [password, setPassword] = useState('');
  const [chkPassword, setChkPassword] = useState('');
  // 유효성 체크용 변수
  const [nicknameValid, setNicknameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  // 비밀번호 표시 토글용 변수
  const [showPassword, setShowPassword] = useState(false);

  // 엔터로 바로 제출용
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 비밀번호 표시 토글 함수
  const togglePwdView = () => {
    setShowPassword(!showPassword);
  };

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  // 닉네임 변경 제출
  const NicknameSubmit: CustomSubmitHandler = async (data) => {
    const { nickname } = data;
    const name = await ChangeNicknameApi(nickname as string);
    if (name) {
      store.setNickname(name);
    }
    setNickname('');
    setNicknameValid(false);
  };

  // 비밀번호 변경 제출
  const PwdSubmit: CustomSubmitHandler = async (data) => {
    if (!chkPassword) {
      window.alert('올바르지 않은 비밀번호 형식입니다');
      setCurrentPwd('');
      setPassword('');
      setChkPassword('');
      setPasswordValid(false);
      return;
    }
    if (!passwordValid) {
      window.alert('비밀번호가 일치하지 않습니다');
      setCurrentPwd('');
      setPassword('');
      setChkPassword('');
      setPasswordValid(false);
      return;
    }
    const response = await CheckPwdApi(data.CurPwd);
    if (response) {
      const changePwdProps: ChangePwdProps = {
        password: data.NewPwd as string,
        chkPassword: data.chkPwd as string,
      };
      await ChangePwdApi(changePwdProps);
    } else {
      window.alert('현재 비밀번호가 틀립니다');
    }
    setCurrentPwd('');
    setPassword('');
    setChkPassword('');
    setPasswordValid(false);
  };

  // 현재 비밀번호 입력
  const CurrentPwdChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCurrentPwd(inputValue);
  };

  // 새 비밀번호 입력
  const NewpwdChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
  };

  // 비밀번호 확인 입력
  const chkPwdChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

  // 닉네임 입력
  const nicknameHandleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNickname(inputValue);
    if (nicknameRegex.test(inputValue)) {
      setNicknameValid(true);
    } else {
      setNicknameValid(false);
    }
  };

  return (
    <div className="border p-2 shadow-md" style={{ height: '333px' }}>
      {/* 닉네임 */}
      <p className="pl-3 pt-6 text-xl">닉네임 변경</p>
      <form onSubmit={handleSubmitNickname(NicknameSubmit)}>
        <div className="mb-1 mt-2 flex items-center">
          <div
            className="ml-2 flex justify-center rounded-2xl border bg-white shadow-md"
            style={{ height: '40px' }}
          >
            <input
              className="rounded-2xl px-3 focus:outline-none "
              type="text"
              placeholder="닉네임"
              {...registerNickname('nickname')}
              minLength={2}
              maxLength={8}
              value={nickname}
              onChange={nicknameHandleChange}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submitButtonRef.current?.focus();
                  handleSubmitNickname(NicknameSubmit)();
                }
              }}
            />
            {nicknameValid ? (
              <button
                className="rounded-2xl border bg-white p-0 pr-4 hover:border-transparent focus:outline-none "
                type="submit"
                ref={submitButtonRef}
              >
                변경
              </button>
            ) : (
              <button className="rounded-2xl border bg-white p-0 pr-4 text-gray-400 hover:border-transparent focus:outline-none">
                변경
              </button>
            )}
          </div>
        </div>
      </form>
      <p className="pl-3 pt-3 text-xl">비밀번호 변경</p>
      {/* 현재 비밀번호 */}
      <form onSubmit={handleSubmitPwd(PwdSubmit)}>
        <div className="mb-1 mt-2 flex items-center">
          <div
            className="ml-2 flex justify-center rounded-2xl border bg-white shadow-md"
            style={{ height: '40px' }}
          >
            <input
              className="mr-2 rounded-2xl px-3 focus:outline-none"
              type={showPassword ? 'text' : 'password'}
              placeholder="현재 비밀번호"
              {...registerPwd('CurPwd')}
              value={currentPwd}
              onChange={CurrentPwdChange}
              autoComplete="current-password"
            />
            <button
              className="rounded-2xl bg-white pl-2 pr-4 hover:border-transparent focus:outline-none"
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
        {/* 새 비밀번호 */}
        <div className="mb-1 mt-2 flex items-center">
          <div
            className="ml-2 flex justify-center rounded-2xl border bg-white shadow-md"
            style={{ height: '40px' }}
          >
            <input
              className="mr-2 rounded-2xl px-3 focus:outline-none "
              type={showPassword ? 'text' : 'password'}
              placeholder="새 비밀번호"
              {...registerPwd('NewPwd')}
              value={password}
              onChange={NewpwdChange}
              autoComplete="new-password"
            />
            <button
              className="rounded-2xl bg-white pl-2 pr-4 hover:border-transparent focus:outline-none"
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
        {/* 비밀번호 확인 */}
        <div className="mb-1 mt-2 flex items-center justify-between">
          <div
            className="ml-2 flex justify-center rounded-2xl border bg-white shadow-md"
            style={{ height: '40px' }}
          >
            <input
              className="rounded-2xl px-3 focus:outline-none "
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              {...registerPwd('chkPwd')}
              value={chkPassword}
              onChange={chkPwdChange}
              autoComplete="new-password"
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submitButtonRef.current?.focus();
                  handleSubmitPwd(PwdSubmit)();
                }
              }}
            />
            {currentPwd && passwordValid ? (
              <button
                className="rounded-2xl border bg-white p-0 pr-4 hover:border-transparent focus:outline-none "
                type="submit"
                ref={submitButtonRef}
              >
                변경
              </button>
            ) : (
              <button className="rounded-2xl border bg-white p-0 pr-4 text-gray-400 hover:border-transparent focus:outline-none">
                변경
              </button>
            )}
          </div>
          <WithdrawalButton />
        </div>
      </form>
    </div>
  );
}
