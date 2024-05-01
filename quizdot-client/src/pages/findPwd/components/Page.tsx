import { useEffect } from 'react';
import { FindPwdForm } from './FindPwdForm';

export function FindPwdPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <FindPwdForm />
    </div>
  );
}
