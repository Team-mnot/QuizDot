// src/pages/survival/store.tsx
import create from 'zustand';
import { iQuiz } from './api/types'; // 경로는 실제 위치에 따라 다를 수 있습니다.

interface QuizStore {
  resultMessage: string;
  showResult: boolean;
  showChatBox: boolean;
  currentQuiz: iQuiz | null;
  isQuizOver: boolean; // 퀴즈 종료 여부 상태 추가

  setCurrentQuiz: (quiz: iQuiz) => void;
  setShowResult: (show: boolean) => void;
  setShowChatBox: (show: boolean) => void;
  setResultMessage: (message: string) => void;
  setIsQuizOver: (value: boolean) => void;
}

const useQuizStore = create<QuizStore>((set) => ({
  resultMessage: '',
  showResult: false,
  showChatBox: false, // 초기 채팅박스 표시 여부
  currentQuiz: null, // 초기 퀴즈는 null로 설정
  isQuizOver: false, // 초기값 설정

  setCurrentQuiz: (quiz: iQuiz) => set({ currentQuiz: quiz }),
  setShowResult: (show: boolean) => set({ showResult: show }),
  setShowChatBox: (show: boolean) => set({ showChatBox: show }),
  setResultMessage: (message) => set({ resultMessage: message }), // message 받는 setMessageResult 함수 쓴다는 뜻 ㅎ
  setIsQuizOver: (value: boolean) => set({ isQuizOver: value }), // isQuizOver 상태를 설정하는 함수 추가
}));

export default useQuizStore;
