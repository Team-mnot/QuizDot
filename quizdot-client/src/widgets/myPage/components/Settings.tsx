// import { useState, useEffect } from 'react';
import { ChangeNicknameApi, ChangePwdApi } from '../api/api';
import { ChangePwdProps } from '../api/types';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function Settings() {
  // 유효성 체크
  const nicknameSchema = z.object({
    nickname: z.string().min(2).max(8),
  });

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const pwdSchema = z.object({
    password: z
      .string()
      .regex(
        passwordRegex,
        '비밀번호는 8자 이상이며 하나 이상의 문자와 숫자를 각자 포함해야 합니다',
      ),
    chkPassword: z
      .string()
      .regex(
        passwordRegex,
        '비밀번호는 8자 이상이며 하나 이상의 문자와 숫자를 각자 포함해야 합니다',
      ),
  });

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: errorsPwd },
  } = useForm({
    resolver: zodResolver(pwdSchema),
  });

  const {
    register: registerNickname,
    handleSubmit: handleSubmitNickname,
    formState: { errors: errorsNickname },
  } = useForm({
    resolver: zodResolver(nicknameSchema),
  });

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  const PwdSubmit: CustomSubmitHandler = async (data) => {
    const changePwdProps: ChangePwdProps = {
      password: data.memberId as string,
      chkPassword: data.password as string,
    };
    await ChangePwdApi(changePwdProps);
  };

  const NicknameSubmit: CustomSubmitHandler = async (data) => {
    const { nickname } = data;
    await ChangeNicknameApi(nickname);
  };

  // 비밀번호 일치 확인
  // const pwdMatched = (password: string, chkPassword: string) => {
  //   return password === chkPassword;
  // };

  // const [password, setPassword] = useState('');
  // const [chkPassword, setChkPassword] = useState('');
  // const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  // useEffect(() => {
  //   setIsPasswordMatched(pwdMatched(password, chkPassword));
  // }, [password, chkPassword]);

  return (
    <div>
      <form onSubmit={handleSubmitNickname(NicknameSubmit)}>
        <div>
          <label>닉네임 변경</label>
          <input type="text" {...registerNickname('password')} />
          {errorsNickname && <span>잘못된 닉네임 형식입니다</span>}
        </div>
        <button type="submit">변경</button>
      </form>
      <form onSubmit={handleSubmitPwd(PwdSubmit)}>
        <div>
          {/* 현재 비밀번호 확인 Api도 따로 있는데 그냥 폼마다 따로 해두는 게 나을지도 */}
          <label>현재 비밀번호</label>
          <input type="password" {...registerPwd('password')} />
          {errorsPwd && <span>잘못된 비밀번호 형식입니다</span>}
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" {...registerPwd('chkPassword')} />
          {errorsPwd && <span>잘못된 비밀번호 형식입니다</span>}
        </div>
        <button type="submit">비밀번호 변경</button>
      </form>
    </div>
  );
}
