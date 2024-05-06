//src/pages/survival/api/types.ts

export interface iCharacter {
  imageUrl: string;
  title: string;
  nickname: string;
  score?: number;
  isAlive: boolean;
  isRevive: boolean;
}

export interface iCharacterInSurvivalMode extends iCharacter {
  position: {
    top: number;
    left: number;
  };
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
