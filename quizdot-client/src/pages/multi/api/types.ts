interface CharacterProps {
  imageUrl: string;
  title: string;
  nickname: string;
  score: number;
}

interface QuizSetProps {
  quiz: QuizProps;
  answer: AnswerProps;
}

interface QuizProps {
  question: string;
  category: string;
}

interface AnswerProps {
  hint: string;
  imageUrl: string;
  type: string;
  answer: string;
  description: string;
}

interface RoomInfo {
  title: string;
  public: boolean;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
}

export type { CharacterProps, QuizSetProps, QuizProps, AnswerProps, RoomInfo };
