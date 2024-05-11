import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function MainPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className={'flex flex-col items-center'}>
        <h1 className="text-rainbow text-center text-8xl font-bold">
          퀴 즈 닷
        </h1>
        <img
          src="/images/ikball.png"
          alt=""
          className="h-[auto] w-[500px] py-2"
        />
        <Link to={'/login'}>
          <h1>시작</h1>
        </Link>
      </div>
    </div>
  );
}
