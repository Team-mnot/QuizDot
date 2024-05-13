import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogInForm } from './LogInForm';
// import { UserInfo } from '@/widgets/userInfo';
// import { MyPage } from '@/widgets/myPage';

export function LoginPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);
  return (
    <div
      className={
        'flex flex-col items-center justify-center rounded-md border bg-white bg-opacity-50 p-6'
      }
    >
      <h1 className="mb-6">로그인</h1>
      <LogInForm />
      <div className="mt-2">
        <span>아직 회원이 아니시라면, </span>
        <Link to={'/sign-up'} className="text-lg">
          <span>회원가입</span>
        </Link>
      </div>
      <div>
        <span>비밀번호를 잊어버리셨다면, </span>
        <Link to={'/find-pwd'} className="text-lg">
          <span className="font-bold">비밀번호 찾기</span>
        </Link>
      </div>

      {/* <UserInfo id={16} />
      <MyPage id={16} /> */}
    </div>
  );
}
