import { useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IdCheckAPi } from '@/pages/signUp/api/api';
import { FindPwdApi } from '../api/api';
import type { FindPwdProps } from '../api/types';

// 유효성 조건
const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const hintRegex = /^[0-9]{6}$/;

// 스키마
const schema = z.object({
  memberId: z.string().regex(idRegex),
  hint: z.string().regex(hintRegex),
});

export function FindPwdForm() {
  const [memberId, setMemberId] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [checkId, setCheckId] = useState<boolean>(true);
  const [idValid, setIdValid] = useState(false);
  const [hintValid, setHintValid] = useState(false);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  type CustomSubmitHandler = SubmitHandler<FieldValues>;

  const onSubmit: CustomSubmitHandler = async (data) => {
    if (checkId) {
      window.alert('존재하지 않는 아이디입니다');
      return;
    }
    const props: FindPwdProps = {
      memberId: data.memberId as string,
      hint: data.hint as string,
    };
    const response = await FindPwdApi(props);
    if (!response) {
      window.alert('힌트가 일치하지 않습니다');
      return;
    } else {
      window.alert('check');
    }
  };

  // 아이디 확인
  const idHandleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 추출
    const truncatedValue = alphanumericValue.slice(0, 20); // 최대 20자리까지만 유지
    setMemberId(truncatedValue);
    const response = await IdCheckAPi(truncatedValue);
    setCheckId(response);
    if (truncatedValue.length >= 6 && idRegex.test(truncatedValue)) {
      setIdValid(true);
    } else {
      setIdValid(false);
    }
    console.log(idValid);
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
    console.log(hintValid);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-1 rounded-lg bg-white p-2 px-3">
        <input
          className="focus:outline-none"
          type="text"
          placeholder="아이디"
          {...register('memberId')}
          onChange={idHandleChange}
          value={memberId}
        />
      </div>
      <div className="mb-1 mt-6 rounded-lg bg-white p-2 px-3">
        <input
          className="focus:outline-none"
          type="text"
          placeholder="비밀번호 힌트"
          {...register('hint')}
          onChange={hintHandleChange}
          value={hint}
        />
      </div>
      <button
        className="mt-6 w-full hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
        type="submit"
      >
        비밀번호 찾기
      </button>
    </form>
  );
}
