import { Modal, Progress } from '@/shared/ui';
import { Quiz } from './Quiz';
import { useContext, useEffect, useRef, useState } from 'react';
import { Answer } from './Answer';

import { TextTypeInput } from './TextTypeInput';
import { OXTypeBtn } from './OXTypeBtn';
import { RankType } from '../api/types';
import { Hint } from './Hint';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { exitGameApi, selectQuizApi, submitAnswerApi } from '../api/api';
import { useOpenModal } from '@/shared/hooks';
import { Reward } from './Reward';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';
import { QuizResult } from './QuizResult';
import { RoomChattingBox } from './RoomChattingBox';

export function QuizPreview({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  // 타이머
  const secCount = useRef<number>(5);
  const maxCount = useRef<number>(5);
  const [updateCount, setUpdateCount] = useState<number>(secCount.current);

  // 게임 준비 화면 활성화
  const isGameReady = useRef<boolean>(true);
  // 보낼 문제 목록 활성화
  const isShowQuizList = useRef<boolean>(false);
  // 보낼 퀴즈 선택 확인
  const isSelectQuiz = useRef<boolean>(false);
  // 선택한 퀴즈 아이디
  const selectedQuiz = useRef<number>(1);
  // 퀴즈 활성화 확인
  const isShowQuiz = useRef<boolean>(false);
  // 답변 제출 확인
  const isSubmitAnswer = useRef<boolean>(false);
  // 제출 답변 상태
  const isCorrectAnswer = useRef<boolean>(false);
  // 힌트 활성화 확인
  const isShowHint = useRef<boolean>(false);
  // 정답 및 해설 활성화 확인
  const isShowAnswer = useRef<boolean>(false);
  // 체력 0 된 사람 체크용
  const isDefeatedPlayer = useRef<boolean>(false);
  // ref 상태 관리를 위한 강제 렌더링용 변수
  const [updateState, setUpdateState] = useState<boolean>(false);
  // ref 상태 관리를 위한 강제 렌더링용 변수
  const [updateStage, setUpdateStage] = useState<boolean>(false);
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
  // 그냥 이상한거 제출해버리는걸로
  const handleSubmitPass = async () => {
    if (isShowAnswer.current) return;
    isSubmitAnswer.current = true;
    setUpdateState(!updateState);
  };

  // 보낼 문제 제출
  const handleSelectQuiz = async (quizId: number) => {
    isShowQuizList.current = false;
    isSelectQuiz.current = true;
    await selectQuizApi(roomId, quizId);
    setUpdateState(!updateState);
  };

  // 해당 문제의 답안 제출 (저장)
  const handleSubmitAnswer = async (myAns: string) => {
    if (
      isShowAnswer.current ||
      !checkQuestionsTruth(myAns, quizSetStore.quiz.answers)
    )
      return;
    isSubmitAnswer.current = true;
    isCorrectAnswer.current = true;
    await submitAnswerApi(roomId, isCorrectAnswer.current);
    setUpdateState(!updateState);
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

  const callbackOfQuiz = async (message: MessageDto) => {
    // quizList에 이거 집어 넣어야겠죠
    console.log(message);
    if (message.type === 'QUIZ') {
      console.log(message.data);
    }
  };

  const callbackOfSelect = async (message: MessageDto) => {
    // quiz에 이거 집어 넣어야겠죠
    console.log(message);
    if (message.type === 'SUBMIT') {
      console.log(message.data);
    }
  };

  const callbackOfUpdate = async (message: MessageDto) => {
    // 플레이어의 점수를 갱신해야 할 경우
    if (message.type == 'UPDATE') {
      // quizSetStore.fetchScores(message.data.playerId, message.data.result);
      // 체력 조정 함수
    }
    // 게임이 끝나서 보상을 받아야 할 경우
    // CHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECK
    else if (message.type == 'EXIT') {
      // 결과 모달을 보여줌
      resultRewards.current = message.data;
      quizSetStore.clearScores();
      setUpdateState(!updateState);
      console.log(message);
      clickRewardModal();
    } else if (message.type === 'REWARD') {
      console.log(message);
    } else if (message.type === 'TITLE') {
      console.log(message);
    }
  };

  useEffect(() => {
    // 로비에서 게임 시작 정보 받았으면
    if (quizSetStore.gameState) {
      quizSetStore.setGameState(false);
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          if (prevCnt >= 1) {
            return prevCnt - 1;
          } else {
            // 게임 준비 정보 그만 보여주고 퀴즈 리스트 보여주기
            isGameReady.current = false;
            isShowQuizList.current = true;
            clearInterval(timer);
            return 5;
          }
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    onSubscribeWithCallBack(
      `quiz/game/${roomId}/${userStore.id}`,
      callbackOfQuiz,
    );
    onSubscribeWithCallBack(
      `info/game/${roomId}/select/${userStore.id}`,
      callbackOfSelect,
    );
    onSubscribeWithCallBack(`info/game/${roomId}`, callbackOfUpdate);
    return () => {
      onUnsubscribe(`quiz/game/${roomId}/${userStore.id}`);
      onUnsubscribe(`info/game/${roomId}/select/${userStore.id}`);
      onUnsubscribe(`info/game/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {
    // 보낼 문제 선택할 때 작동할 타이머
    if (isShowQuizList.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 선택하지 않았다면 시간이 점차 감소함
          if (prevCnt >= 1 && !isSelectQuiz) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈추고 아무거나 제출
          else {
            isShowQuizList.current = false; // 문제 제공 해제
            handleSelectQuiz(selectedQuiz.current);
            isSelectQuiz.current = true;
            isShowQuiz.current = true;
            maxCount.current = 10;

            setUpdateStage(!updateStage);

            clearInterval(timer);
            return 5;
          }
        });
      }, 1000);
    }

    // 문제 선택할 때 작동할 타이머
    if (isShowQuiz.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            // 5 초가 되면 힌트가 제공됨
            if (prevCnt - 1 == 5) isShowHint.current = true;
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈추고 정답을 제공함
          else {
            isShowQuiz.current = false; // 문제 제공 해제
            isShowHint.current = false;
            isShowAnswer.current = true; // 정답 제공 설정
            maxCount.current = 5;

            setUpdateStage(!updateStage);

            clearInterval(timer);
            return 5;
          }
        });
      }, 1000); // 1
    }
    // 2. 정답 제공 시 작동할 타이머
    else if (isShowAnswer.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          else {
            // 체력이 0인 사람이 있다면 멈춤
            // CHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECKCHECK
            if (isDefeatedPlayer) {
              isShowAnswer.current = false; // 정답 제공 해제
              isShowQuiz.current = false; // 문제 제공 해제

              // 방장이 게임 종료 호출
              // 정상 종료 안 되면 몇 초 뒤 다시 시도하는 코드 추가하기
              if (
                roomStore.roomInfo &&
                roomStore.roomInfo.hostId == userStore.id
              ) {
                handleExitGame(roomId);
              }

              clearInterval(timer);
              return 0;
            }
            // 아직 남았으면 다음 문제를 제공함
            else {
              // 다시 다음 문제 받기

              maxCount.current = 10; // 문제 제공 설정
              isShowQuizList.current = true;
              isSelectQuiz.current = false;
              isShowQuiz.current = false;
              isSubmitAnswer.current = false;
              isShowAnswer.current = false; // 정답 제공 해제
              isCorrectAnswer.current = false;

              setUpdateStage(!updateStage);

              clearInterval(timer);
              return 15;
            }
          }
        });
      }, 1000);
    }
  }, [updateStage]);

  return (
    <div className="absolute left-0 top-[60px] w-full">
      <div>
        {isGameReady.current && <div>5초후 게임이 시작됩니다</div>}
        {isShowQuizList.current && (
          <Quiz
            index={1}
            question={quizSetStore.quiz.question}
            category={quizSetStore.quiz.category}
            questionType={quizSetStore.quiz.questionType}
            imagePath={quizSetStore.quiz.imagePath}
          />
        )}
        {isShowAnswer.current && (
          <QuizResult isResult={isCorrectAnswer.current} />
        )}
        {isShowQuiz.current && (
          <Quiz
            index={1}
            question={quizSetStore.quiz.question}
            category={quizSetStore.quiz.category}
            questionType={quizSetStore.quiz.questionType}
            imagePath={quizSetStore.quiz.imagePath}
          ></Quiz>
        )}
        <Progress
          padding="py-5"
          size="w-[500px]"
          color={updateCount <= 5 ? 'yellow' : 'lightgreen'}
          label={`${updateCount}`}
          currentValue={updateCount}
          maxValue={maxCount.current}
        ></Progress>

        {isShowHint.current && <Hint hint={quizSetStore.quiz.hint} />}
        {isShowAnswer.current && (
          <Answer
            answers={quizSetStore.quiz.answers}
            description={quizSetStore.quiz.description}
          />
        )}
        {isShowQuiz.current &&
          !isSubmitAnswer.current &&
          quizSetStore.quiz.questionType == 'OX' && (
            <OXTypeBtn
              handleSubmitAnswer={handleSubmitAnswer}
              handleSubmitPass={handleSubmitPass}
            />
          )}
        {isShowQuiz.current &&
          !isSubmitAnswer.current &&
          quizSetStore.quiz.questionType != 'OX' && (
            <TextTypeInput
              handleSubmitAnswer={handleSubmitAnswer}
              handleSubmitPass={handleSubmitPass}
            />
          )}
        <RoomChattingBox
          roomId={roomId}
          visible={isSubmitAnswer.current || isCorrectAnswer.current}
        />
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
