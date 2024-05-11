import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  channelId: number;
  enterChannel: (channelId: number) => void;
  leaveChannel: () => void;

  roomId: number;
  enterRoom: (roomId: number) => void;
  leaveRoom: () => void;
}

const useGameStore = create(
  persist<GameStore>(
    (set) => ({
      channelId: 0,
      enterChannel: (channelId: number) => {
        set({ channelId: channelId });
      },
      leaveChannel: () => {
        set({ channelId: 0 });
      },
      roomId: 0,
      enterRoom: (roomId: number) => {
        set({ roomId: roomId });
      },
      leaveRoom: () => {
        set({ roomId: 0 });
      },
    }),

    {
      name: 'gameStorage',
    },
  ),
);

export { useGameStore };
