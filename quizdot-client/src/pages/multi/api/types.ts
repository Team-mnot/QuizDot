export interface CharacterProps {
  imageUrl: string;
  title: string;
  nickname: string;
  score: number;
}

export interface QuizSetProps {
  quiz: QuizProps;
  answer: AnswerProps;
}

export interface QuizProps {
  question: string;
  category: string;
}

export interface AnswerProps {
  hint: string;
  imageUrl: string;
  type: string;
  answer: string;
  description: string;
}
