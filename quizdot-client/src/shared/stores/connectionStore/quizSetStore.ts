import { QuizSetType } from '@/pages/multi/api/types';
import { ScoresType } from '@/pages/waitingRoom/api/types';
// import { ScoresType } from '@/pages/waitingRoom/api/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizSetStore {
  gameState: boolean;
  setGameState: (state: boolean) => void;

  quiz: QuizSetType;
  fetchQuiz: (quiz: QuizSetType) => void;
  clearQuiz: () => void;

  quizzes: QuizSetType[];
  AddQuizzes: (quiz: QuizSetType) => void;
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
      gameState: false,
      setGameState: (state: boolean) => set({ gameState: state }),

      quiz: {
        id: -1,
        question: '',
        hint: '',
        imagePath: '',
        category: '',
        questionType: '',
        description: '',
        answers: [],
      },
      fetchQuiz: (quiz: QuizSetType) => {
        set({ quiz: quiz });
      },
      clearQuiz: () => {
        set({
          quiz: {
            id: -1,
            question: '',
            hint: '',
            imagePath: '',
            category: '',
            questionType: '',
            description: '',
            answers: [],
          },
        });
      },

      quizzes: [],
      fetchQuizzes: (quizzes: QuizSetType[]) => {
        set({ quizzes: quizzes });
      },
      AddQuizzes: (quiz: QuizSetType) => {
        set((state) => ({
          quizzes: { ...state.quizzes, quiz },
        }));
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
