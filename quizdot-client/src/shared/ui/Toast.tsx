import { useEffect } from 'react';

interface ToastProps {
  message: string;
  setToastState: (status: boolean) => void;
}

export function Toast(props: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.setToastState(false); // 2초 뒤, toastState가 false가 되면서 알림창이 사라진다
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={
        'h-30 fixed z-50 flex items-center justify-center rounded-md border-2 bg-white p-2 shadow-md'
      }
      onClick={() => props.setToastState(false)}
    >
      <img src="/images/ikball.png" alt="" className="h-[23px] w-[23px]" />
      <div className={'font-bold'}>{props.message}</div>
    </div>
  );
}
