// src/pages/survival/store.tsx
import create from 'zustand';
import { PlayerInSurvivalMode, iQuiz } from './api/types'; // 경로는 실제 위치에 따라 다를 수 있습니다.

interface PlayerStore {
  players: PlayerInSurvivalMode[];
  setPlayers: (players: PlayerInSurvivalMode[]) => void;
  updatePlayerStatus: (playerId: number, isAlive: boolean) => void;
}

// playerId : 타입에 없는데~?
const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  setPlayers: (players: PlayerInSurvivalMode[]) => set({ players }),
  updatePlayerStatus: (playerId, isAlive) => {
    set((state) => {
      const updatedPlayers = state.players.map((player) =>
        player.id === playerId ? { ...player, isAlive } : player,
      );
      return { players: updatedPlayers };
    });
  },
}));

interface QuizStore {
  quizzes: iQuiz[];
  setQuizzes: (quizzes: iQuiz[]) => void;

  currentQuiz: iQuiz | null;
  setCurrentQuiz: (quiz: iQuiz) => void;

  currentQuizIndex: number;
  resultMessage: string; // 결과메세지 ( 증답~ 오답~ )
  showResult: boolean; // 결과페이지 렌더링할까?
  showChatBox: boolean; // 정답 제출 해야 채팅박스 보여줌
  isQuizOver: boolean; // 퀴즈 종료 여부 상태 추가
  showCountDown: boolean;
  isCorrect: boolean;
  isGameOver: boolean;

  setCurrentQuizIndex: (index: number) => void;
  setShowResult: (show: boolean) => void;
  setResultMessage: (message: string) => void;
  setShowChatBox: (show: boolean) => void;
  setIsQuizOver: (value: boolean) => void;
  setIsGameOver: (value: boolean) => void;
  setShowCountDown: (value: boolean) => void;
  setIsCorrect: (isCorrect: boolean) => void;

  showHint: boolean; // 힌트 표시 여부
  setShowHint: (show: boolean) => void; // 힌트 표시 여부 변경 액션

  reset: () => void; // 상태 초기화를 위한 리셋 메서드
}

const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  setQuizzes: (quizzes: iQuiz[]) => {
    console.log('Updating quizzes state:', quizzes);
    set({ quizzes });
  },

  currentQuiz: null, // 초기 퀴즈는 null로 설정
  setCurrentQuiz: (quiz: iQuiz) => set({ currentQuiz: quiz }),

  currentQuizIndex: 0,
  resultMessage: '',
  showResult: false,
  showChatBox: false, // 초기 채팅박스 표시 여부
  showCountDown: false,
  isQuizOver: false,
  isGameOver: false,
  isCorrect: false,

  setCurrentQuizIndex: (index: number) => set({ currentQuizIndex: index }),
  setShowResult: (show: boolean) => set({ showResult: show }),
  setShowChatBox: (show: boolean) => set({ showChatBox: show }),
  setResultMessage: (message) => set({ resultMessage: message }), // message 받는 setMessageResult 함수 쓴다는 뜻 ㅎ
  setShowCountDown: (show: boolean) => set({ showCountDown: show }),
  setIsQuizOver: (value: boolean) => set({ isQuizOver: value }),
  setIsGameOver: (value: boolean) => set({ isGameOver: value }),
  setIsCorrect: (value: boolean) => set({ isCorrect: value }),

  showHint: false, // 초기 힌트 표시 여부는 false로 설정
  setShowHint: (show: boolean) => set({ showHint: show }), // 힌트 표시 여부 변경 액션

  reset: () =>
    set({
      quizzes: [],
      currentQuiz: null,
      currentQuizIndex: 0,
      resultMessage: '',
      showResult: false,
      showChatBox: false,
      showCountDown: false,
      isQuizOver: false,
      isGameOver: false,
      isCorrect: false,
      showHint: false,
    }), // 초기 상태로 리셋
}));

export { useQuizStore, usePlayerStore };
