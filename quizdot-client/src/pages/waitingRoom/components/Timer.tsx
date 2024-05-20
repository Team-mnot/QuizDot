// export function Timer {
//     const timer = setInterval(() => {
//         // 시간이 점차 감소함
//         if (secCount.current >= 1) {
//           secCount.current = secCount.current - 1;

//           // 5 초가 되면 힌트가 제공됨
//           if (secCount.current == 5) isShowHint.current = true;

//           setForceUpdate(!forceUpdate);
//         }
//         // 0 초가 되면 답을 제공하기 위해 설정되고 리턴
//         else {
//           isShowQuiz.current = false;
//           isShowHint.current = false;
//           isShowAnswer.current = true;
//           // isSubmitAnswer.current = false;
//           secCount.current = 5;
//           // myAnswer.current = answer;

//           setForceUpdate(!forceUpdate);

//           clearInterval(timer);
//         }
//       });
//     return (<div>{secCount}</div>);
// }
