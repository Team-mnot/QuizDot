import { QuizSetType } from '@/pages/multi/api/types';
import { ScoresType } from '@/pages/waitingRoom/api/types';
// import { ScoresType } from '@/pages/waitingRoom/api/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizSetStore {
  quizzes: QuizSetType[];
  fetchQuizzes: (quizzes: QuizSetType[]) => void;
  clearQuizzes: () => void;

  scores: ScoresType;
  fetchScores: (playerId: number, score: number) => void;
  clearScores: () => void;

  reset: () => void;
}

const useQuizSetStore = create(
  persist<QuizSetStore>(
    (set) => ({
      quizzes: [],
      fetchQuizzes: (quizzes: QuizSetType[]) => {
        set({ quizzes: quizzes });
      },
      clearQuizzes: () => {
        set({ quizzes: [] });
      },

      scores: {},
      fetchScores: (playerId: number, score: number) => {
        set((state) => ({
          scores: { ...state.scores, [playerId]: score },
        }));
      },
      clearScores: () => {
        set({ scores: {} });
      },

      reset: () => {
        set({ quizzes: [], scores: {} });
      },
    }),
    {
      name: 'quizStorage',
    },
  ),
);

export { useQuizSetStore };
