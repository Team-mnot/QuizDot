// // import { ChangeNickname } from '../api/api';
// import { ChangePwdApi } from '../api/api';
// import { ChangePwdProps } from '../api/types';
// import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// const pwdSchema = z.object({
//   memberId: z.string().min(8).max(20),
//   password: z
//     .string()
//     .regex(
//       passwordRegex,
//       '비밀번호는 8자 이상이며 하나 이상의 문자와 숫자를 각자 포함해야 합니다',
//     ),
// });

// const {
//   register,
//   handleSubmit,
//   formState: { errors },
// } = useForm({
//   resolver: zodResolver(pwdSchema),
// });

// type CustomSubmitHandler = SubmitHandler<FieldValues>;

// const PwdSubmit: CustomSubmitHandler = async (data) => {
//   const changePwdProps: ChangePwdProps = {
//     password: data.memberId as string,
//     chkPassword: data.password as string,
//   };
//   await ChangePwdApi(changePwdProps);
// };

export function Settings() {
  return (
    <div>
      <div>
        닉네임
        <input type="text" />
        <button>닉네임 변경</button>
      </div>
    </div>
  );
}

// <form onSubmit={handleSubmit(PwdSubmit)}>
// <div>
//   {/* 현재 비밀번호 확인 Api도 따로 있는데 그냥 폼마다 따로 해두는 게 나을지도 */}
//   <label>현재 비밀번호</label>
//   <input type="password" {...register('password')} />
//   {errors.password && <span>잘못된 비밀번호 형식입니다</span>}
// </div>
// <div>
//   <label>비밀번호</label>
//   <input type="password" {...register('chkPassword')} />
//   {errors.chkPassword && <span>잘못된 비밀번호 형식입니다</span>}
// </div>
// <button type="submit">Log In</button>
// </form>
