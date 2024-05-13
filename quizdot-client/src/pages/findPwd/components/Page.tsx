import { useEffect } from 'react';
import { FindPwdForm } from './FindPwdForm';

export function FindPwdPage() {
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
      <FindPwdForm />
    </div>
  );
}
