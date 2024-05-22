const openList = { 1: '공개', 0: '비공개' } as { [key: number]: string };

const modeList = {
  NORMAL: '일반 모드',
  SURVIVAL: '서바이벌 모드',
  ILGITO: '일기토 모드',
} as { [key: string]: string };

const maxPeopleList = {
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
} as { [key: number]: number };

const categoryList = {
  RANDOM: '랜덤',
  COMMON: '상식',
  CULTURE: '문화',
  PRIVIEW: '시사',
  ECONOMY: '경제',
  GRAMMAR: '한국어',
} as { [key: string]: string };

const maxQuestionList = { 30: 30, 20: 20, 10: 10 } as {
  [key: number]: number;
};

const roomStateColors = {
  INPROGRESS: 'bg-slate-400',
  WAITING: 'bg-white hover:bg-gray-200 active:bg-gray-300',
  MATCHING: 'bg-red-200',
} as { [key: string]: string };

export {
  openList,
  modeList,
  maxPeopleList,
  categoryList,
  maxQuestionList,
  roomStateColors,
};
