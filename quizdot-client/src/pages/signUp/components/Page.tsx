import { useEffect } from 'react';
import { SignUpForm } from './SignUpForm';

export function SignUpPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-md border bg-white bg-opacity-50 p-6">
      <h1 className="mb-6">회원가입</h1>
      <SignUpForm />
    </div>
  );
}
