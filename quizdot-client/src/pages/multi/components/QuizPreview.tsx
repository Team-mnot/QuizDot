import { CoverModal, Progress } from '@/shared/ui';
import { Quiz } from './Quiz';
import { useContext, useEffect, useRef, useState } from 'react';
import { Answer } from './Answer';

import { TextTypeInput } from './TextTypeInput';
import { OXTypeBtn } from './OXTypeBtn';
import { RankType } from '../api/types';
import { getQuizzesApi, passQuestionApi } from '@/shared/apis/commonApi';
import { Hint } from './Hint';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { exitGameApi, updateScoresApi } from '../api/api';
import { useOpenModal } from '@/shared/hooks';
import { Reward } from './Reward';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';
import { QuizResult } from './QuizResult';
import { RoomChattingBox } from './RoomChattingBox';

export function QuizPreview() {
  // 문제 리스트, 유저 정보
  const quizSetStore = useQuizSetStore();
  const roomStore = useRoomStore();
  const userStore = useUserStore();

  const roomId = roomStore.roomInfo!.roomId;
  const channelId = Math.floor(roomStore.roomInfo!.roomId / 1000);

  // 게임 준비 화면 활성화
  const isGameReady = useRef<boolean>(true);

  // 현재 문제 리스트의 인덱스
  const quizIndex = useRef<number>(0);
  // 타이머
  const secCount = useRef<number>(10);
  const maxCount = useRef<number>(10);
  const [updateCount, setUpdateCount] = useState<number>(secCount.current);
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
  // ref 상태 관리를 위한 강제 렌더링용 변수
  const [updateState, setUpdateState] = useState<boolean>(false);
  // ref 상태 관리를 위한 강제 렌더링용 변수
  const [updateStage, setUpdateStage] = useState<boolean>(false);
  // 게임 결과
  const resultRewards = useRef<RankType[]>([]);

  const { isOpenModal: isOpenRewardModal, clickModal: clickRewardModal } =
    useOpenModal();

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  // 문제 패스
  const handleSubmitPass = async () => {
    if (isShowAnswer.current) return;

    await passQuestionApi(roomId, quizSetStore.quizzes[quizIndex.current].id);

    isSubmitAnswer.current = true;
    setUpdateState(!updateState);
  };

  // 해당 문제의 답안 제출 (저장)
  const handleSubmitAnswer = async (myAns: string) => {
    if (
      isShowAnswer.current ||
      !checkQuestionsTruth(
        myAns,
        quizSetStore.quizzes[quizIndex.current].answers,
      )
    )
      return;
    isSubmitAnswer.current = true;
    isCorrectAnswer.current = true;
    await updateScoresApi(roomId, quizSetStore.quizzes[quizIndex.current].id);
    setUpdateState(!updateState);
  };

  // 해당 문제의 정답 여부 판단
  const checkQuestionsTruth = (myAns: string, ansList: string[]) => {
    if (
      ansList.indexOf(myAns) >= 0 ||
      ansList.indexOf(myAns.replace(/^\s+|\s+$/g, '')) >= 0
    )
      return true;
    else return false;
  };

  // 게임 종료
  const handleExitGame = async () => {
    await exitGameApi(roomId);
  };

  // 문제를 받음
  const handleReceiveQuizzes = async () => {
    if (roomStore.roomInfo) {
      await getQuizzesApi(
        roomStore.roomInfo.roomId,
        roomStore.roomInfo.category,
        roomStore.roomInfo.maxQuestion,
        roomStore.roomInfo.gameMode,
      );
    }
  };

  const callbackOfQuiz = async (message: MessageDto) => {
    quizSetStore.fetchQuizzes(message.data);
  };

  const callbackOfInfo = async (message: MessageDto) => {
    // 플레이어의 점수를 갱신해야 할 경우
    if (message.type == 'UPDATE') {
      quizSetStore.fetchScores(message.data.playerId, message.data.score);
    }
    // 모두가 패스했을 경우
    if (message.type == 'PASS') {
      // 모든 플레이어가 답을 제출했다면 정답 제공으로 넘어가기 위해 카운트를 줄임
      setUpdateCount(0);

      // isShowQuiz.current = false; // 문제 제공 해제
      // isShowHint.current = false;
      // isShowAnswer.current = true; // 정답 제공 설정
      // maxCount.current = 5;

      // setUpdateStage(!updateStage);
    }
    // 게임이 끝나서 보상을 받아야 할 경우
    else if (message.type == 'REWARD') {
      // 결과 모달을 보여줌
      resultRewards.current = message.data;
      quizSetStore.clearScores();
      setUpdateState(!updateState);
      console.log(message);
      clickRewardModal();
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`info/game/${roomId}`, callbackOfInfo);
    onSubscribeWithCallBack(`quiz/game/${roomId}`, callbackOfQuiz);

    return () => {
      onUnsubscribe(`info/game/${roomId}`);
      onUnsubscribe(`quiz/game/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {
    // 1. 게임 시작 타이머 (새로고침 해도 처음만 작동)
    if (quizSetStore.gameState) {
      quizSetStore.setGameState(false);
      isGameReady.current = true;
      if (roomStore.roomInfo!.hostId == userStore.id) handleReceiveQuizzes();

      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          if (prevCnt >= 1) {
            return prevCnt - 1;
          } else {
            isShowQuiz.current = true;
            clearInterval(timer);
            isGameReady.current = false;
            setUpdateStage(!updateStage);
            return 10;
          }
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // 2. 문제 제공 시 작동할 타이머
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
      }, 1000);
    }
    // 3. 정답 제공 시 작동할 타이머
    else if (isShowAnswer.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          else {
            // 모든 퀴즈가 제공되었다면 결과 화면으로 넘어감
            if (quizIndex.current >= quizSetStore.quizzes.length - 1) {
              isShowAnswer.current = false; // 정답 제공 해제
              isShowQuiz.current = false; // 문제 제공 해제

              // 방장이 게임 종료 호출
              // 정상 종료 안 되면 몇 초 뒤 다시 시도하는 코드 추가하기
              if (
                roomStore.roomInfo &&
                roomStore.roomInfo.hostId == userStore.id
              ) {
                handleExitGame();
              }

              clearInterval(timer);
              return 0;
            }
            // 아직 남았으면 다음 문제를 제공함
            else {
              quizIndex.current = quizIndex.current + 1; // 다음 문제의 인덱스로

              maxCount.current = 15; // 문제 제공 설정
              isShowQuiz.current = true;
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
    <div className="absolute left-[0px] top-[10px] w-full">
      <div className="text-center">
        {isGameReady.current && (
          <div className="mt-[100px] text-4xl">
            {updateCount} 초 후 게임이 시작됩니다
          </div>
        )}
        {(isShowQuiz.current || isShowAnswer.current) && (
          <div className="flex justify-center">
            <Progress
              padding="py-2"
              size="w-[640px]"
              color={updateCount <= 5 ? 'yellow' : 'lightgreen'}
              label={`${updateCount}`}
              currentValue={updateCount}
              maxValue={maxCount.current}
            ></Progress>
          </div>
        )}
        {isShowAnswer.current && (
          <div className="flex justify-center">
            <QuizResult isResult={isCorrectAnswer.current} />
          </div>
        )}
        {isShowQuiz.current && (
          <div className="flex justify-center">
            <Quiz
              index={quizIndex.current + 1}
              question={quizSetStore.quizzes[quizIndex.current].question}
              category={quizSetStore.quizzes[quizIndex.current].category}
              questionType={
                quizSetStore.quizzes[quizIndex.current].questionType
              }
              imagePath={quizSetStore.quizzes[quizIndex.current].imagePath}
            ></Quiz>
          </div>
        )}

        {isShowHint.current && (
          <div className="flex justify-center">
            <Hint hint={quizSetStore.quizzes[quizIndex.current].hint} />
          </div>
        )}
        {isShowAnswer.current && (
          <div className="flex justify-center">
            <Answer
              answers={quizSetStore.quizzes[quizIndex.current].answers}
              description={quizSetStore.quizzes[quizIndex.current].description}
            />
          </div>
        )}
        {isShowQuiz.current &&
          !isSubmitAnswer.current &&
          quizSetStore.quizzes[quizIndex.current].questionType == 'OX' && (
            <div className="flex justify-center">
              <OXTypeBtn
                handleSubmitAnswer={handleSubmitAnswer}
                handleSubmitPass={handleSubmitPass}
              />
            </div>
          )}
        {isShowQuiz.current &&
          !isSubmitAnswer.current &&
          quizSetStore.quizzes[quizIndex.current].questionType != 'OX' && (
            <div className="flex justify-center">
              <TextTypeInput
                handleSubmitAnswer={handleSubmitAnswer}
                handleSubmitPass={handleSubmitPass}
              />
            </div>
          )}
        <RoomChattingBox
          roomId={roomId}
          visible={
            isSubmitAnswer.current ||
            isCorrectAnswer.current ||
            isShowAnswer.current
          }
        />
      </div>
      <CoverModal isOpen={isOpenRewardModal}>
        <Reward
          ranks={resultRewards.current}
          roomId={roomId}
          channelId={channelId}
        />
      </CoverModal>
    </div>
  );
}
