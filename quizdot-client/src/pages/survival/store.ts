// src/pages/survival/store.tsx
import create from 'zustand';
import { iQuiz } from './api/types'; // 경로는 실제 위치에 따라 다를 수 있습니다.

interface QuizStore {
  quizzes: iQuiz[];
  currentQuiz: iQuiz | null;
  currentQuizIndex: number;
  resultMessage: string; // 결과메세지 ( 증답~ 오답~ )
  showResult: boolean; // 결과페이지 렌더링할까?
  showChatBox: boolean; // 정답 제출 해야 채팅박스 보여줌
  isQuizOver: boolean; // 퀴즈 종료 여부 상태 추가
  showCountDown: boolean;

  setQuizzes: (quizzes: iQuiz[]) => void;
  setCurrentQuiz: (quiz: iQuiz) => void;
  setCurrentQuizIndex: (index: number) => void;
  setShowResult: (show: boolean) => void;
  setResultMessage: (message: string) => void;
  setShowChatBox: (show: boolean) => void;
  setIsQuizOver: (value: boolean) => void;
  setShowCountDown: (value: boolean) => void;
}

const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  currentQuizIndex: 0,
  resultMessage: '',
  showResult: false,
  showChatBox: false, // 초기 채팅박스 표시 여부
  currentQuiz: null, // 초기 퀴즈는 null로 설정
  isQuizOver: false,
  showCountDown: false,

  setQuizzes: (quizzes: iQuiz[]) => set({ quizzes }),
  setCurrentQuiz: (quiz: iQuiz) => set({ currentQuiz: quiz }),
  setCurrentQuizIndex: (index: number) => set({ currentQuizIndex: index }),
  setShowResult: (show: boolean) => set({ showResult: show }),
  setShowChatBox: (show: boolean) => set({ showChatBox: show }),
  setResultMessage: (message) => set({ resultMessage: message }), // message 받는 setMessageResult 함수 쓴다는 뜻 ㅎ
  setIsQuizOver: (value: boolean) => set({ isQuizOver: value }),
  setShowCountDown: (show: boolean) => set({ showCountDown: show }),
}));

export default useQuizStore;
