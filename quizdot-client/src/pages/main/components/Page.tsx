import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gif1 from '/images/1.gif';
import gif2 from '/images/2.gif';
import gif3 from '/images/3.gif';
import gif4 from '/images/4.gif';
import gif5 from '/images/5.gif';
import gif6 from '/images/6.gif';
import gif7 from '/images/7.gif';
import gif8 from '/images/8.gif';
import gif9 from '/images/9.gif';
import gif10 from '/images/10.gif';
import gif11 from '/images/11.gif';

export function MainPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/forest01.jpg)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  const gifs = [
    gif1,
    gif2,
    gif3,
    gif4,
    gif5,
    gif6,
    gif7,
    gif8,
    gif9,
    gif10,
    gif11,
  ];
  const positions = [
    { top: '72%', left: '48%' }, // 남자
    { top: '55%', left: '34%' }, // 고양이
    { top: '67%', left: '60%' }, // 치타
    { top: '68%', left: '79%' }, // 다람쥐
    { top: '82%', left: '74%' }, // 공룡
    { top: '70%', left: '33%' }, // 원숭이
    { top: '65%', left: '72%' }, // 토끼
    { top: '82%', left: '87%' }, // 양
    { top: '82%', left: '25%' }, // 치킨
    { top: '60%', left: '25%' }, // 쥐
    { top: '72%', left: '52%' }, // 여성
  ];

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <div className={'flex flex-col items-center'}>
        <h1 className="text-border text-center text-8xl font-bold text-green-500">
          퀴 즈 닷
        </h1>
        <Link to={'/login'}>
          <h1 className="text-border">시작</h1>
        </Link>
      </div>
      {gifs.map((gif, index) => (
        <img
          key={index}
          src={gif}
          alt={`gif${index + 1}`}
          style={{
            position: 'absolute',
            top: positions[index].top,
            left: positions[index].left,
            width: '70px',
            height: '70px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
