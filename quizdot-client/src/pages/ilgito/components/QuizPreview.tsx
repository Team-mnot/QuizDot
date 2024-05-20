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

interface userCheck {
  [key: string]: string;
}

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
  const isGameReady = useRef<boolean>(quizSetStore.gameState);

  // 이번 라운드 상대에게 퀴즈를 보낼 수 있는지
  const isThrowQuiz = useRef<boolean>(true);
  // 어떤 인덱스의 문제를 선택했는지
  const selectedIndex = useRef<number>(-1);
  // 문제를 받아와야 하는지
  const isReceiveQuizzes = useRef<boolean>(false);
  // 이번 라운드 점수 업데이트 카운트
  const submitCount = useRef<userCheck>({});
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

    isCorrectAnswer.current = false; // 오답 제출 상태
    isSubmitAnswer.current = true; // 답 제출 상태
    setUpdateState(!updateState);
    await updateScoresApi(roomId, false);
  };

  // 해당 문제의 답안 제출
  const handleSubmitAnswer = async (myAns: string) => {
    // 이미 제출했거나 제출 시간이 아닌 경우에도 리턴
    if (
      isSubmitAnswer.current ||
      !isShowQuiz.current ||
      !checkQuestionsTruth(myAns, quizSetStore.quiz.answers)
    )
      return;

    isCorrectAnswer.current = true; // 정답 제출 상태
    isSubmitAnswer.current = true; // 답 제출 상태
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

  const callbackOfQuiz = (message: MessageDto) => {
    // 상대에게 퀴즈를 보내기 위해 받음
    if (message.type === 'QUIZ') {
      quizSetStore.fetchQuizzes([
        message.data[0],
        message.data[1],
        message.data[2],
      ]);

      console.log('저장완료햇서여 ', quizSetStore.quizzes);
      // 문제를 받으면 다음 타이머로
      isReceiveQuizzes.current = false;
      isThrowQuiz.current = false; // 문제를 보낼 수 있게 설정
      maxCount.current = 5;
      setUpdateCount(5);
      setUpdateStage((prev) => {
        return !prev;
      });
    }
  };

  const callbackOfSelect = (message: MessageDto) => {
    // 상대에게 퀴즈를 받음
    if (message.type === 'SUBMIT') {
      quizSetStore.fetchQuiz(message.data);

      console.log('쩌짱완료 ', quizSetStore.quiz);

      setRound((prevRound) => {
        // 해당 라운드
        return prevRound + 1;
      });

      // // 퀴즈를 보냈고, 퀴즈를 받았다면 다음 타이머로 넘어감
      // if (isThrowQuiz.current && quizSetStore.quiz.id != -1) {
      //   console.log('퀴즈를받은것으로끝');
      //   isShowQuiz.current = true; // 문제 제공 설정
      //   maxCount.current = 15;
      //   setUpdateCount(15);
      //   setUpdateStage(!updateStage); // 다음 타이머를 진행
      // }
    }
  };

  const callbackOfUpdate = (message: MessageDto) => {
    // 플레이어의 점수를 갱신해야 할 경우
    if (message.type == 'UPDATE') {
      quizSetStore.fetchScores(message.data.playerId, message.data.score);

      // 현재 점수가 0 인 플레이어의 존재 여부
      if (message.data.score == 0) isDefeatedPlayer.current = true;

      // 현재 제출한 플레이어 수
      submitCount.current[message.data.id] = '.';
      setUpdateState(!updateState);

      // 모든 플레이어의 점수가 갱신되면 다음 라운드를 진행하기 위해 시간을 단축함
      if (Object.keys(submitCount.current).length == 2) {
        submitCount.current = {};
        setUpdateCount(0);
      }
    }
    // 게임을 끝냄
    else if (message.type == 'EXIT') {
      isDefeatedPlayer.current = true;
      setUpdateState(!updateState);
    }
    // 게임이 끝나서 보상을 받아야 할 경우
    else if (message.type == 'REWARD') {
      // 결과 모달을 보여줌
      resultRewards.current = message.data;
      quizSetStore.clearScores();
      setUpdateState(!updateState);
      clickRewardModal();
    }
  };

  // 퀴즈를 보냄
  const handleSubmitQuiz = async (questionId: number) => {
    await selectQuestionApi(roomId, questionId);

    // // 퀴즈를 보냈고, 퀴즈를 받았다면 다음 타이머로 넘어감
    // if (isThrowQuiz.current && quizSetStore.quiz.id != -1) {
    //   console.log('퀴즈를보낸것으로끝');
    //   isShowQuiz.current = true; // 문제 제공 설정
    //   maxCount.current = 15;
    //   setUpdateCount(15);
    //   setUpdateStage(!updateStage); // 다음 타이머를 진행
    // }
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
    if (quizSetStore.gameState) {
      quizSetStore.setGameState(false);
      isGameReady.current = false;

      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          if (prevCnt >= 1) {
            return prevCnt - 1;
          } else {
            isReceiveQuizzes.current = true; // 문제를 받을 수 있게 설정
            maxCount.current = 5;
            clearInterval(timer);
            setUpdateStage(!updateStage);
            return 5;
          }
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // 2. 퀴즈 전송 전 문제를 받아옴
    if (isReceiveQuizzes.current) {
      quizSetStore.clearQuiz();
      quizSetStore.clearQuizzes();

      if (roomStore.roomInfo!.hostId == userStore.id)
        handleReceiveQuizzes()
          .then(() => {
            console.log('퀴즈 저장 성공');
          })
          .catch((error) => {
            console.error('퀴즈 저장 실패:', error);
          });
    }
    // 2. 퀴즈 전송 시 작동할 타이머
    else if (!isThrowQuiz.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          // 아직 문제 전송 전이면 랜덤으로 전송함
          else {
            setUpdateState(!updateState);
            if (selectedIndex.current == -1)
              selectedIndex.current = getRandomNumber();
            setUpdateState(!setUpdateState);

            if (quizSetStore.quizzes.length > 0) {
              const id = quizSetStore.quizzes[selectedIndex.current].id;
              handleSubmitQuiz(id)
                .then(() => {
                  console.log('퀴즈 전송 성공');

                  selectedIndex.current = -1;
                  isShowQuiz.current = true; // 문제 제공 설정
                  maxCount.current = 15;
                  isThrowQuiz.current = true;
                  quizSetStore.clearQuizzes();
                  setUpdateStage(!updateStage); // 다음 타이머를 진행
                })
                .catch((error) => {
                  console.error('퀴즈 전송 실패:', error);
                });
            }
            clearInterval(timer);
            return 15;
          }
        });
      }, 1000);
      console.log('2 타이머 중단');
    }

    // 3. 퀴즈 풀이 시 작동할 타이머
    else if (isShowQuiz.current) {
      const timer = setInterval(() => {
        setUpdateCount((prevCnt) => {
          // 시간이 점차 감소함
          if (prevCnt >= 1) {
            // 체력이 0 인 사람이 있다면 게임을 종료함
            if (isDefeatedPlayer.current == true) {
              isShowAnswer.current = false; // 정답 제공 해제
              isShowQuiz.current = false; // 문제 제공 해제

              handleExitGame();
              clearInterval(timer);
              return 0;
            } else return prevCnt - 1;
          }
          // 0 초가 되면 타이머를 멈춤
          // 아직 정답 제출 전이면 쓰레기 값으로 제출함
          else {
            if (!isSubmitAnswer.current) {
              handleForceSubmitAnswer()
                .then(() => {
                  console.log('퀴즈 제출 성공');
                })
                .catch((error) => {
                  console.error('퀴즈 제출 실패:', error);
                });
            }

            // 체력이 0 인 사람이 있다면 게임을 종료함
            if (isDefeatedPlayer.current == true) {
              isShowAnswer.current = false; // 정답 제공 해제
              isShowQuiz.current = false; // 문제 제공 해제

              handleExitGame();
              clearInterval(timer);
              return 0;
            }

            isShowQuiz.current = false; // 문제 제공 해제
            isShowAnswer.current = true; // 정답 제공 설정
            maxCount.current = 5;

            clearInterval(timer);

            setUpdateStage(!updateStage); // 다음 타이머를 진행
            return 5;
          }
        });
      }, 1000);
      console.log('3 타이머 중단');
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

              handleExitGame();
              clearInterval(timer);
              return 0;
            }
            // 아직 남았으면 다음 문제를 제공함
            else {
              isSubmitAnswer.current = false;
              isShowAnswer.current = false;
              isCorrectAnswer.current = false;
              isReceiveQuizzes.current = true; // 문제를 받아오도록 설정
              // isThrowQuiz.current = false; // 아직 문제를 보내지 않았다고 설정
              maxCount.current = 5;

              setUpdateStage(!updateStage);
              clearInterval(timer);
              return 5;
            }
          }
        });
      }, 1000);
      console.log('4 타이머 중단');
    }
  }, [updateStage]);

  return (
    <div className="absolute left-[0px] top-[60px] w-full">
      <div>
        {isGameReady.current && (
          <div>{updateCount} 초 후 게임이 시작됩니다</div>
        )}

        {isShowAnswer.current && (
          <QuizResult isResult={isCorrectAnswer.current} />
        )}
        {/* 퀴즈를 받았으나 보내지 않았음, 선택해야 함 */}
        {!isThrowQuiz.current && selectedIndex.current == -1 && (
          <div>
            {quizSetStore.quizzes.map((item, index) => (
              <div
                key={item.id}
                className="p-2 bg-white"
                onClick={() => {
                  selectedIndex.current = index;
                }}
              >
                {item.category}
              </div>
            ))}
          </div>
        )}
        {isShowQuiz.current && quizSetStore.quiz.id != -1 && (
          <Quiz
            index={round}
            question={quizSetStore.quiz.question}
            category={quizSetStore.quiz.category}
            questionType={quizSetStore.quiz.questionType}
            imagePath={quizSetStore.quiz.imagePath}
          ></Quiz>
        )}
        {(!isThrowQuiz.current ||
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
        {isShowAnswer.current && quizSetStore.quiz.id != -1 && (
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
