//src/pages/survival/api/types.ts

export interface Player {
  characterId: number;
  level: number;
  nickname: string;
  nicknameColor: string;
  title: string;
}

export interface PlayerInSurvivalMode extends Player {
  id: number; // 추가된 부분
  position: {
    top: number;
    left: number;
  };
  isAlive: boolean;
  isRevive: boolean;
}

export interface iQuiz {
  id: number;
  question: string;
  hint: string;
  imagePath: string;
  category: string;
  questionType: string;
  description: string;
  answers: string[];
}

export interface iQuizList {
  status: number;
  message: string;
  data: {
    quizResList: iQuiz[];
  };
}

export interface GameResult {
  score: number;
  value: number;
}
