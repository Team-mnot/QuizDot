// // src/pages/survival/components/CountDown.tsx

// import { useEffect, useState } from 'react';

// export function CountDown() {
//   const [count, setCount] = useState(1); // 카운트다운 시간 설정
//   const { setShowCountDown } = useQuizStore();

//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (count > 1) {
//         setCount(count - 1);
//       } else {
//         clearInterval(timer);
//         setShowCountDown(false); // 카운트다운 상태를 false로 설정
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="fixed left-0 right-0 top-10 mx-auto max-w-3xl">
//       <div className="flex justify-center">
//         <h1>{count}초 뒤 퀴즈 </h1>
//       </div>
//     </div>
//   );
// }
