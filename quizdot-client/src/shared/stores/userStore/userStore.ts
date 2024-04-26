import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { baseApi } from '@/shared/apis/';
import axios from 'axios';

interface UserState {}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      userId: 0,
      nickname: '',
      image: '',
      level: 0,
      exp: 0,
      isLogin: false,
      getData: async () => {
        try {
          const response = await axios.get(`${baseApi}/users/info`, {
            withCredentials: true,
          });
          const responseData = response.data.data;
          set({
            userId: responseData.id,
            nickname: responseData.nickname,
            image: responseData.image,
            followingCount: responseData.followingCount,
            followerCount: responseData.followerCount,
            role: responseData.role,
            isLogin: true,
          });
        } catch (error) {
          console.error('Error get user info');
        }
      },
    }),
    {
      name: 'userStorage',
    },
  ),
);

export { useUserStore };
