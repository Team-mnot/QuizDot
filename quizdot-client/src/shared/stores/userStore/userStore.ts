import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/pages/logIn/api/types';

interface UserState {
  id: number;
  title: string;
  nickname: string;
  nicknameColor: string;
  characterId: number;
  level: number;
  exp: number;
  point: number;
  isLogin: boolean;
  getData: (props: UserInfo) => void;
  resetData: () => void;
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      id: 0,
      title: '',
      nickname: '',
      nicknameColor: '',
      characterId: 0,
      level: 0,
      exp: 0,
      point: 0,
      isLogin: false,
      getData: (props: UserInfo) => {
        const { id, title, nickname, nicknameColor, level, exp, point } = props;
        set({
          id,
          title,
          nickname,
          nicknameColor,
          level,
          exp,
          point,
          isLogin: true,
        });
      },
      resetData: () => {
        set({
          id: 0,
          title: '',
          nickname: '',
          nicknameColor: '',
          characterId: 0,
          level: 0,
          exp: 0,
          point: 0,
          isLogin: false,
        });
      },
    }),

    {
      name: 'userStorage',
    },
  ),
);

export { useUserStore };
