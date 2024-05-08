import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChannelStore {
  channelId: number;
  setChannelId: (channelId: number) => void;
  resetChannelId: () => void;
}

const useChannelStore = create(
  persist<ChannelStore>(
    (set) => ({
      channelId: 0,
      setChannelId: (channelId: number) => {
        set({ channelId: channelId });
      },
      resetChannelId: () => {
        set({ channelId: 0 });
      },
    }),

    {
      name: 'channelStorage',
    },
  ),
);

export { useChannelStore };
