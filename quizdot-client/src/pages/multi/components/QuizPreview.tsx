import { Modal, Progress } from '@/shared/ui';
import { Quiz } from './Quiz';
import { useContext, useEffect, useRef, useState } from 'react';
import { Answer } from './Answer';

import { TextTypeInput } from './TextTypeInput';
import { OXTypeBtn } from './OXTypeBtn';
import { QuizSetType, RankType } from '../api/types';
import { passQuestion } from '@/shared/apis/commonApi';
import { Hint } from './Hint';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';
import { useGameStore } from '@/shared/stores/connectionStore/gameStore';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { exitGameApi, updateScoresApi } from '../api/api';
import { useOpenModal } from '@/shared/hooks';
import { Reward } from './Reward';

export function QuizPreview({
  quizSet,
  roomId,
  channelId,
}: {
  quizSet: QuizSetType[];
  roomId: number;
  channelId: number;
}) {
  // 문제 리스트
  const quizzes = useRef<QuizSetType[]>(quizSet);
  // 현재 문제 리스트의 인덱스
  const quizIndex = useRef<number>(0);
  // 타이머
  const secCount = useRef<number>(10);
  // 퀴즈 활성화 확인
  const isShowQuiz = useRef<boolean>(true);
  // 답변 제출 확인
  const isSubmitAnswer = useRef<boolean>(false);
  // 힌트 활성화 확인
  const isShowHint = useRef<boolean>(false);
  // 정답 및 해설 활성화 확인
  const isShowAnswer = useRef<boolean>(false);
  // 게임 결과
  const resultRewards = useRef<RankType[]>([]);
  // ref 상태 관리를 위한 강제 렌더링용 변수
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const {
    isOpenModal: isOpenRewardModal,
    clickModal: clickRewardModal,
    closeModal: closeRewardModal,
  } = useOpenModal();

  const gameStore = useGameStore();
  const userStore = useUserStore();

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  // 문제 패스
  const handleSubmitPass = async () => {
    const response = await passQuestion(
      roomId,
      quizzes.current[quizIndex.current].id,
    );

    if (response == 200) console.log('성공!');
  };

  // 해당 문제의 답안 제출 (저장)
  const handleSubmitAnswer = (myAns: string) => {
    isSubmitAnswer.current = true;

    if (!checkQuestionsTruth(myAns, quizzes.current[quizIndex.current].answers))
      return;

    updateScoresApi(roomId, quizzes.current[quizIndex.current].id);
  };

  // 해당 문제의 정답 여부 판단
  const checkQuestionsTruth = (myAns: string, ansList: string[]) => {
    if (ansList.indexOf(myAns) >= 0 || ansList.indexOf(myAns.trim()) >= 0)
      return true;
    else return false;
  };

  // 게임 종료
  const handleExitGame = (_roomId: number) => {
    exitGameApi(_roomId);
  };

  const callbackOfInfo = async (message: MessageDto) => {
    console.log('INFO: ', message);
    // 플레이어의 점수를 갱신해야 할 경우
    if (message.type == 'UPDATE') {
      gameStore.fetchScores(message.data.playerId, message.data.score);
    }
    // 모두가 패스했을 경우
    else if (message.type == 'PASS') {
      secCount.current = 0;
    }
    // 게임이 끝나서 보상을 받아야 할 경우
    else if ((message.type = 'REWARD')) {
      // 결과 모달을 보여줌
      resultRewards.current = message.data;
      gameStore.clearScores();

      setForceUpdate(!forceUpdate);
      clickRewardModal();
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`info/room/${roomId}`, callbackOfInfo);

    return () => {
      onUnsubscribe(`info/room/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {}, [forceUpdate, gameStore.scores]);

  useEffect(() => {
    // 1. 문제 제공 시 작동할 타이머
    if (isShowQuiz.current) {
      const timer = setInterval(() => {
        // 시간이 점차 감소함
        if (secCount.current >= 1) {
          secCount.current = secCount.current - 1;

          // 5 초가 되면 힌트가 제공됨
          if (secCount.current == 5) isShowHint.current = true;

          setForceUpdate(!forceUpdate);
        }
        // 0 초가 되면 답을 제공하기 위해 설정되고 리턴
        else {
          isShowQuiz.current = false;
          isShowHint.current = false;
          isShowAnswer.current = true;
          // isSubmitAnswer.current = false;
          secCount.current = 5;
          // myAnswer.current = answer;

          setForceUpdate(!forceUpdate);

          clearInterval(timer);
        }
      });
    }

    // 2. 정답 제공 시 작동할 타이머
    else if (isShowAnswer.current) {
      const timer = setInterval(() => {
        // 시간이 점차 감소함
        if (secCount.current >= 1) {
          secCount.current = secCount.current - 1;

          setForceUpdate(!forceUpdate);
        }
        // 0 초가 되면 다음 문제로 넘어가기 위해 설정되고 리턴
        else {
          // 모든 퀴즈가 제공되었다면 타이머를 멈추고 결과 화면으로 넘어감
          if (quizIndex.current >= quizzes.current.length - 1) {
            console.log('문제 제공 완료');
            isShowAnswer.current = false;
            isShowQuiz.current = false;

            setForceUpdate(!forceUpdate);

            // 방장이 게임 종료 호출
            // 근데 방장이 바뀌면 누군지 또 알아와야 될 것 같은데
            if (gameStore.roomInfo?.hostId == userStore.id) {
              handleExitGame(roomId);
            }

            clearInterval(timer);
          }
          // 아직 남았으면 다음 문제를 제공함
          else {
            quizIndex.current = quizIndex.current + 1;

            // isShowQuiz.current = false;
            // isShowHint.current = false;
            isShowAnswer.current = false;
            isSubmitAnswer.current = false;
            secCount.current = 10;

            setForceUpdate(!forceUpdate);

            clearInterval(timer);
          }
        }
      });
    }
  }, [secCount]);

  return (
    <div className={'absolute left-0 top-[60px] w-full'}>
      <div>
        <Quiz
          question={quizzes.current[quizIndex.current].question}
          category={quizzes.current[quizIndex.current].category}
          questionType={quizzes.current[quizIndex.current].questionType}
          imagePath={quizzes.current[quizIndex.current].imagePath}
        ></Quiz>

        <Progress
          padding={'py-5'}
          size={'w-[500px]'}
          color={secCount.current <= 5 ? 'yellow' : 'pink'}
          label={`${secCount.current}`}
          currentValue={secCount.current}
          maxValue={10}
        ></Progress>

        {isShowHint.current && (
          <Hint hint={quizzes.current[quizIndex.current].category} />
        )}
        {isShowAnswer.current && (
          <Answer
            answers={quizzes.current[quizIndex.current].answers}
            description={quizzes.current[quizIndex.current].description}
          />
        )}
        {!isSubmitAnswer.current &&
        quizzes.current[quizIndex.current].questionType == 'OX ' ? (
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
