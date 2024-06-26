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
  setTitle: (title: string) => void;
  setNickname: (name: string) => void;
  setNicknameColor: (color: string) => void;
  setCharacterId: (id: number) => void;
  setPoint: () => void;
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
      setTitle: (title: string) => set({ title: title }),
      setNickname: (name: string) => set({ nickname: name }),
      setNicknameColor: (color: string) => set({ nicknameColor: color }),
      setCharacterId: (id: number) => set({ characterId: id }),
      setPoint: () =>
        set((prevState) => ({ ...prevState, point: prevState.point - 10000 })),
      getData: (props: UserInfo) => {
        const {
          id,
          characterId,
          title,
          nickname,
          nicknameColor,
          level,
          exp,
          point,
        } = props;
        set({
          id,
          characterId,
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
