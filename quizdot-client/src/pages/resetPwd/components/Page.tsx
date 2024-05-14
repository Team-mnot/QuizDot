import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResetPwdForm } from './ResetPwdForm';

export function ResetPwdPage() {
  const navi = useNavigate();
  const location = useLocation();
  const [memberId, setMemberId] = useState<string>('');

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';

    const memberId = location.state?.memberId;
    if (memberId === undefined) {
      window.alert('비정상적인 접근입니다');
      navi(-1);
    } else {
      setMemberId(memberId);
      navi(location.pathname, { replace: true, state: {} });
    }
  }, []);

  return (
    <div
      className={
        'flex flex-col items-center justify-center rounded-md border bg-white bg-opacity-50 p-6'
      }
    >
      <h1 className="mb-6">비밀번호 재설정</h1>
      <ResetPwdForm id={memberId as string} />
    </div>
  );
}
