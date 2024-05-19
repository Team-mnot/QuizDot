import { CoverModal, Progress } from '@/shared/ui';
import { Quiz } from './Quiz';
import { useContext, useEffect, useRef, useState } from 'react';
import { Answer } from './Answer';

import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { useOpenModal } from '@/shared/hooks';
import { Reward } from './Reward';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';
import { QuizResult } from './QuizResult';
import { RoomChattingBox } from './RoomChattingBox';
import { exitGameApi, selectQuestionApi, updateScoresApi } from '../api/api';
import { RankType } from '@/pages/multi/api/types';
import { getQuizzesApi } from '@/shared/apis/commonApi';

export function QuizPreview() {
  // 문제 리스트, 유저 정보
  const quizSetStore = useQuizSetStore();
  const roomStore = useRoomStore();
  const userStore = useUserStore();

  const roomId = roomStore.roomInfo!.roomId;
  const channelId = Math.floor(roomStore.roomInfo!.roomId / 1000);

  const secCount = useRef<number>(5);
  const maxCount = useRef<number>(5);
  const [updateCount, setUpdateCount] = useState<number>(secCount.current);

  // 게임 준비 화면 활성화
  const isGameReady = useRef<boolean>(true);

  // 이번 라운드 상대에게 퀴즈를 보냈는지
  const isThrowQuiz = useRef<boolean>(false);

  // 이번 라운드 점수 업데이트 카운트
  const [roundCount, setRoundCound] = useState<number>(1);
  // 이번 라운드 카운트
  const [round, setRound] = useState<number>(0);

  // // 보낼 퀴즈 선택 확인
  // const isSelectQuiz = useRef<boolean>(false);
  // // 선택한 퀴즈 아이디
  // const selectedQuiz = useRef<number>(1);
  // 체력 0 된 사람 체크용
  const isDefeatedPlayer = useRef<boolean>(false);

  // 퀴즈 활성화 확인
  const isShowQuiz = useRef<boolean>(false);
  // 답변 제출 확인
  const isSubmitAnswer = useRef<boolean>(false);
  // 제출 답변 상태
  const isCorrectAnswer = useRef<boolean>(false);
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

  // 해당 문제의 임의 답안 제출
  const handleForceSubmitAnswer = async () => {
    if (isSubmitAnswer.current || !isShowQuiz.current) return;

    isCorrectAnswer.current = false;
    isSubmitAnswer.current = true;
    setUpdateState(!updateState);
    await updateScoresApi(roomId, false);
  };

  // 해당 문제의 답안 제출
  const handleSubmitAnswer = async (myAns: string) => {
    if (
      isSubmitAnswer.current ||
      !isShowQuiz.current ||
      !checkQuestionsTruth(myAns, quizSetStore.quiz.answers)
    )
      return;

    isCorrectAnswer.current = true;
    isSubmitAnswer.current = true;
    setUpdateState(!updateState);
    await updateScoresApi(roomId, true);
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

  const callbackOfQuiz = async (message: MessageDto) => {
    // 상대에게 퀴즈를 보내기 위해 받음
    console.log(message);
    if (message.type === 'QUIZ') {
      console.log(message.data);
      quizSetStore.clearQuizzes();
      quizSetStore.fetchQuizzes(message.data);
      // quizSetStore.fetchQuizzes(message.data[0]);
      // quizSetStore.fetchQuizzes(message.data[1]);
      // quizSetStore.fetchQuizzes(message.data[2]);
    }
  };
  const callbackOfSelect = async (message: MessageDto) => {
    // 상대에게 퀴즈를 받음
    console.log(message);
    if (message.type === 'SUBMIT') {
      console.log(message.data);
      quizSetStore.fetchQuiz(message.data);
    }
  };

  const callbackOfUpdate = async (message: MessageDto) => {
    // 플레이어의 점수를 갱신해야 할 경우
    if (message.type == 'UPDATE') {
      console.log(message.data);

      quizSetStore.fetchScores(message.data.playerId, message.data.score);

      // 현재 점수가 0 인 플레이어의 존재 여부
      if (message.data.score == 0) isDefeatedPlayer.current = true;

      // 현재 제출한 플레이어 수
      setRoundCound((prevCnt) => {
        return prevCnt + 1;
      });

      // 모든 플레이어의 점수가 갱신되면 다음 라운드를 진행하기 위해 시간을 단축함
      if (roundCount == 2) {
        setRoundCound(0);
        setUpdateCount(0);
      }
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

  // 퀴즈를 보냄
  const handleSubmitQuiz = async (questionId: number) => {
    await selectQuestionApi(roomId, questionId);

    isThrowQuiz.current = true;
    setUpdateState(!updateState);
  };

  // 0-2 중에 랜덤으로 선택함
  const getRandomNumber = () => {
    const numbers = [0, 1, 2];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  };

  //  문제를 받음
  const handleReceiveQuizzes = async () => {
    if (roomStore.roomInfo) {
      await getQuizzesApi(
        roomStore.roomInfo.roomId,
        roomStore.roomInfo.category,
        6,
        roomStore.roomInfo.gameMode,
      );
    }
  };

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
    // 1. 게임 시작 타이머 (새로고침 해도 처음만 작동)
    if (isGameReady.current) {
      quizSetStore.setGameState(false);
      isGameReady.current = true;
      quizSetStore.clearQuiz();
      if (roomStore.roomInfo!.hostId == userStore.id) handleReceiveQuizzes();

      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          if (prevCnt >= 1) {
            return prevCnt - 1;
          } else {
            clearInterval(timer);
            return 5;
          }
        });
      }, 1000);
    }
    // 2. 퀴즈 전송 시 작동할 타이머
    else if (!isThrowQuiz.current) {
      setRound((prevRound) => {
        return prevRound + 1;
      });

      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          // 아직 문제 전송 전이면 랜덤으로 전송함
          else {
            if (!isThrowQuiz.current) {
              const index = getRandomNumber();
              handleSubmitQuiz(quizSetStore.quizzes[index].id);
            }

            isShowQuiz.current = true; // 문제 제공 설정
            maxCount.current = 15;
            setUpdateCount(15);

            clearInterval(timer);
            setUpdateStage(!updateStage); // 다음 타이머를 진행
            return 15;
          }
        });
      }, 1000);
    }

    // 3. 퀴즈 풀이 시 작동할 타이머
    else if (isShowQuiz.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          // 아직 정답 제출 전이면 쓰레기 값으로 제출함
          else {
            if (!isSubmitAnswer.current) {
              handleForceSubmitAnswer();
            }

            isShowQuiz.current = false; // 문제 제공 해제
            isShowAnswer.current = true; // 정답 제공 설정
            maxCount.current = 5;
            setUpdateCount(5);

            clearInterval(timer);

            setUpdateStage(!updateStage); // 다음 타이머를 진행
            return 5;
          }
        });
      }, 1000);
    }

    // 4. 정답 제공 시 작동할 타이머
    else if (isShowAnswer.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          else {
            // 체력이 0 인 사람이 있다면 게임을 종료함
            if (isDefeatedPlayer.current == true) {
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
              isSubmitAnswer.current = false;
              isShowAnswer.current = false;
              isCorrectAnswer.current = false;
              isThrowQuiz.current = false; // 아직 문제를 보내지 않았다고 설정

              if (roomStore.roomInfo!.hostId == userStore.id)
                handleReceiveQuizzes();

              maxCount.current = 5;
              setUpdateCount(5);
              setUpdateStage(!updateStage);

              clearInterval(timer);
              return 5;
            }
          }
        });
      }, 1000);
    }
  }, [updateStage]);

  return (
    <div className="absolute left-[0px] top-[60px] w-full">
      <div>
        {quizSetStore.gameState && (
          <div>{updateCount} 초 후 게임이 시작됩니다</div>
        )}

        {isShowAnswer.current && (
          <QuizResult isResult={isCorrectAnswer.current} />
        )}
        {/* 퀴즈를 받았으나 보내지 않았음, 선택해야 함 */}
        {!isThrowQuiz.current && quizSetStore.quizzes && (
          <div>
            {quizSetStore.quizzes.map((item) => (
              <div
                className="bg-white p-2"
                onClick={() => handleSubmitQuiz(item.id)}
              >
                {item.category}
              </div>
            ))}
          </div>
        )}
        {isShowQuiz.current && (
          <Quiz
            index={round}
            question={quizSetStore.quiz.question}
            category={quizSetStore.quiz.category}
            questionType={quizSetStore.quiz.questionType}
            imagePath={quizSetStore.quiz.imagePath}
          ></Quiz>
        )}
        {(isGameReady ||
          !isThrowQuiz.current ||
          isShowQuiz.current ||
          isShowAnswer.current) && (
          <Progress
            padding="py-5"
            size="w-[500px]"
            color={updateCount <= 5 ? 'yellow' : 'lightgreen'}
            label={`${updateCount}`}
            currentValue={updateCount}
            maxValue={maxCount.current}
          ></Progress>
        )}
        {isShowAnswer.current && (
          <Answer
            answers={quizSetStore.quiz.answers}
            description={quizSetStore.quiz.description}
          />
        )}
        {/* {isShowQuiz.current &&
          !isSubmitAnswer.current &&
          quizSetStore.quiz.questionType == 'OX' && (
            <OXTypeBtn handleSubmitAnswer={handleSubmitAnswer} />
          )}
        {isShowQuiz.current &&
          !isSubmitAnswer.current &&
          quizSetStore.quiz.questionType != 'OX' && (
            <TextTypeInput handleSubmitAnswer={handleSubmitAnswer} />
          )} */}
        <RoomChattingBox
          roomId={roomId}
          handleSubmitAnswer={handleSubmitAnswer}
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
