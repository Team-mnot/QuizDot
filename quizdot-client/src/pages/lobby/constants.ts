const openList = { 1: '공개', 0: '비공개' } as { [key: number]: string };

const modeList = {
  NORMAL: '일반 모드',
  SURVIVAL: '서바이벌 모드',
  ONETOONE: '일대일 모드',
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
  PREVIEW: '시사',
  ECONOMY: '경제',
  GRAMMER: '한국어',
} as { [key: string]: string };

const maxQuestionList = { 30: 30, 20: 20, 10: 10 } as {
  [key: number]: number;
};

const roomStateColors = {
  INPROGRESS: 'gray-300',
  WAITING: 'green-300',
  MATCHING: 'red-300',
} as { [key: string]: string };

export {
  openList,
  modeList,
  maxPeopleList,
  categoryList,
  maxQuestionList,
  roomStateColors,
};