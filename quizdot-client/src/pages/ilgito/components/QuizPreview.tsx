import { Modal, Progress } from '@/shared/ui';
import { Quiz } from './Quiz';
import { useContext, useEffect, useRef, useState } from 'react';
import { Answer } from './Answer';

import { TextTypeInput } from './TextTypeInput';
import { OXTypeBtn } from './OXTypeBtn';
import { RankType } from '../api/types';
import { passQuestion } from '@/shared/apis/commonApi';
import { Hint } from './Hint';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { exitGameApi, updateScoresApi } from '../api/api';
import { useOpenModal } from '@/shared/hooks';
import { Reward } from './Reward';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';

export function QuizPreview({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  // 현재 문제 리스트의 인덱스
  const quizIndex = useRef<number>(0);
  // 문제 공개에서 정답 공개로
  const [updateAnswer, setUpdateAnswer] = useState<number>(0);
  // 타이머
  // const initTimer = {
  //   lastSavedElapsedTime: 0,
  //   elapsedTime: 0,
  //   intervalId: 'timer',
  //   start: 0,
  // };
  // const timer = useRef(initTimer);
  // const cu = timer.current;
  // const [elapsedTime, setElapsedTime] = useState(cu.lastSavedElapsedTime);
  const secCount = useRef<number>(10);
  const maxCount = useRef<number>(10);
  const [updateCount, setUpdateCount] = useState<number>(secCount.current);
  // 퀴즈 활성화 확인
  const isShowQuiz = useRef<boolean>(true);
  // 답변 제출 확인
  const isSubmitAnswer = useRef<boolean>(false);
  // 힌트 활성화 확인
  const isShowHint = useRef<boolean>(false);
  // 정답 및 해설 활성화 확인
  const isShowAnswer = useRef<boolean>(false);
  // ref 상태 관리를 위한 강제 렌더링용 변수
  const [updateState, setUpdateState] = useState<boolean>(false);
  // 게임 결과
  const resultRewards = useRef<RankType[]>([]);

  const {
    isOpenModal: isOpenRewardModal,
    clickModal: clickRewardModal,
    closeModal: closeRewardModal,
  } = useOpenModal();

  // 문제 리스트, 유저 정보
  const quizSetStore = useQuizSetStore();
  const roomStore = useRoomStore();
  const userStore = useUserStore();

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  // 문제 패스
  const handleSubmitPass = async () => {
    const response = await passQuestion(
      roomId,
      quizSetStore.quizzes[quizIndex.current].id,
    );

    if (response == 200) {
      console.log('패스성공!');

      // isSubmitAnswer.current = true;
      // setUpdateState(!updateState);
    } else console.log('패스실패');
  };

  // 해당 문제의 답안 제출 (저장)
  const handleSubmitAnswer = async (myAns: string) => {
    if (
      checkQuestionsTruth(
        myAns,
        quizSetStore.quizzes[quizIndex.current].answers,
      )
    ) {
      isSubmitAnswer.current = true;
      await updateScoresApi(roomId, quizSetStore.quizzes[quizIndex.current].id);
      setUpdateState(!updateState);
    }
  };

  // 해당 문제의 정답 여부 판단
  const checkQuestionsTruth = (myAns: string, ansList: string[]) => {
    if (ansList.indexOf(myAns) >= 0 || ansList.indexOf(myAns.trim()) >= 0)
      return true;
    else return false;
  };

  // 게임 종료
  const handleExitGame = async (_roomId: number) => {
    await exitGameApi(_roomId);
  };

  const callbackOfInfo = async (message: MessageDto) => {
    console.log('INFO: ', message);
    // 플레이어의 점수를 갱신해야 할 경우
    if (message.type == 'UPDATE') {
      quizSetStore.fetchScores(message.data.playerId, message.data.score);
    }
    // 모두가 패스했을 경우
    else if (message.type == 'PASS') {
      setUpdateCount(0);
    }
    // 게임이 끝나서 보상을 받아야 할 경우
    else if ((message.type = 'REWARD')) {
      // 결과 모달을 보여줌
      resultRewards.current = message.data;
      quizSetStore.clearScores();
      setUpdateState(!updateState);
      clickRewardModal();
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`info/game/${roomId}`, callbackOfInfo);

    return () => {
      onUnsubscribe(`info/game/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {
    // 2. 정답 제공 시 작동할 타이머
    if (isShowAnswer.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 다음 문제로 넘어가기 위해 설정되고 리턴
          else {
            // 모든 퀴즈가 제공되었다면 타이머를 멈추고 결과 화면으로 넘어감
            if (quizIndex.current >= quizSetStore.quizzes.length - 1) {
              console.log('문제 제공 완료');
              isShowAnswer.current = false;
              isShowQuiz.current = false;

              clearInterval(timer);

              // 방장이 게임 종료 호출
              // 근데 방장이 바뀌면 누군지 또 알아와야 될 것 같은데
              // 정상 종료 안 되면 몇 초 뒤 다시 시도하는 코드 추가하기
              if (roomStore.roomInfo?.hostId == userStore.id) {
                handleExitGame(roomId);
              }

              return prevCnt;
            }
            // 아직 남았으면 다음 문제를 제공함
            else {
              quizIndex.current = quizIndex.current + 1;
              // isShowQuiz.current = false;
              // isShowHint.current = false;
              maxCount.current = 10;
              isSubmitAnswer.current = false;
              isShowAnswer.current = false;

              clearInterval(timer);
              setUpdateAnswer((prevAns) => {
                return prevAns + 1;
              });
              return 10;
            }
          }
        });
      }, 1000);
    }
    // 1. 문제 제공 시 작동할 타이머
    else if (isShowQuiz.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            // 5 초가 되면 힌트가 제공됨
            if (prevCnt - 1 == 5) isShowHint.current = true;
            return prevCnt - 1;
          }
          // 0 초가 되면 답을 제공하기 위해 설정되고 리턴
          else {
            // 본인이 정답을 제출하지 않았다면 자동 패스 제출
            if (!isSubmitAnswer) handleSubmitPass();

            // isCorrectAnswer.current = false;
            // isShowQuiz.current = false;
            isShowHint.current = false;
            isShowAnswer.current = true;
            maxCount.current = 5;
            // isSubmitAnswer.current = false;
            // myAnswer.current = answer;
            clearInterval(timer);
            setUpdateAnswer((prevAns) => {
              return prevAns + 1;
            });

            return 5;
          }
        });
      }, 1000);
    }
  }, [updateAnswer]);

  return (
    <div className="absolute left-0 top-[60px] w-full">
      <div>
        <div>{isSubmitAnswer.current ? '정답!' : '오답~~'}</div>
        <Quiz
          question={quizSetStore.quizzes[quizIndex.current].question}
          category={quizSetStore.quizzes[quizIndex.current].category}
          questionType={quizSetStore.quizzes[quizIndex.current].questionType}
          imagePath={quizSetStore.quizzes[quizIndex.current].imagePath}
        ></Quiz>

        <Progress
          padding={'py-5'}
          size={'w-[500px]'}
          color={updateCount <= 5 ? 'yellow' : 'lightgreen'}
          label={`${updateCount}`}
          currentValue={updateCount}
          maxValue={maxCount.current}
        ></Progress>

        <div className="text-center">
          <p>secCount: {secCount.current}</p>
          <p>maxCount: {maxCount.current}</p>
          <p>updateCount: {updateCount}</p>
          <p>isShowQuiz: {isShowQuiz.current ? 1 : 0}</p>
          <p>isSubmitAnswer: {isSubmitAnswer.current ? 1 : 0}</p>
          <p>isShowHint: {isShowHint.current ? 1 : 0}</p>
          <p>isShowAnswer: {isShowAnswer.current ? 1 : 0}</p>
          <p>updateState: {updateState}</p>
          <p>resultRewards: {resultRewards.current.length}</p>
        </div>

        {isShowHint.current && (
          <Hint hint={quizSetStore.quizzes[quizIndex.current].category} />
        )}
        {isShowAnswer.current && (
          <Answer
            answers={quizSetStore.quizzes[quizIndex.current].answers}
            description={quizSetStore.quizzes[quizIndex.current].description}
          />
        )}
        {!isSubmitAnswer.current &&
        quizSetStore.quizzes[quizIndex.current].questionType == 'OX ' ? (
          <OXTypeBtn
            handleSubmitAnswer={handleSubmitAnswer}
            handleSubmitPass={handleSubmitPass}
          />
        ) : (
          <TextTypeInput
            handleSubmitAnswer={handleSubmitAnswer}
            handleSubmitPass={handleSubmitPass}
          />
        )}
      </div>
      <Modal isOpen={isOpenRewardModal} onClose={closeRewardModal}>
        <Reward
          ranks={resultRewards.current}
          roomId={roomId}
          channelId={channelId}
        />
      </Modal>
    </div>
  );
}
