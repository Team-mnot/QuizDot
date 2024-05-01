import { useEffect } from 'react';
import { SignUpForm } from './SignUpForm';

export function SignUpPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <h1>회원가입</h1>
      <SignUpForm />
    </div>
  );
}
