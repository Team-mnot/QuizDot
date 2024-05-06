import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogInForm } from './LogInForm';
import { LogOutButton } from '@/shared/components';
import { UserInfo } from '@/widgets/userInfo';

export function LoginPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);
  return (
    <div
      className={
        'flex h-screen w-screen flex-col items-center justify-center text-center'
      }
    >
      <LogInForm />
      <div>
        <Link to={'/sign-up'}>
          <button
            className={
              'rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600'
            }
          >
            회원가입
          </button>
        </Link>
        <Link to="/find-pwd">
          <button
            className={
              'rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600'
            }
          >
            비밀번호 찾기
          </button>
        </Link>
      </div>
      <LogOutButton />
      <UserInfo id={16} />
    </div>
  );
}
