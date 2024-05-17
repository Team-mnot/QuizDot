/*** 캐릭터 타입 ***/
interface CharacterType {
  imageUrl: string;
  title: string;
  nickname: string;
  score: number;
}

/*** 게임 대기실에서 넘어온 방 정보 타입 ***/
interface RoomInfoDto {
  title: string;
  public: boolean;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
}

/*** 받아온 문제 세트 타입 ***/
interface QuizSetType {
  id: number;
  question: string;
  hint: string;
  imagePath: string;
  category: string;
  questionType: string;
  description: string;
  answers: string[];
}

/*** 플레이어 랭킹 타입 ***/
interface RankType {
  id: number;
  level: number;
  curLevel: number;
  nickname: string;
  rank: number;
  score: number;
  point: number;
  curExp: number;
}

export type { CharacterType, RoomInfoDto, QuizSetType, RankType };
