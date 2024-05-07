import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompatClient } from '@stomp/stompjs';
import { Ref } from 'react';

interface ChannelStore {
  channelId: number;
  socket: Ref<CompatClient | null>;
  setChannelId: (channelId: number) => void;
  resetChannelId: () => void;
}

const useChannelStore = create(
  persist<ChannelStore>(
    (set) => ({
      channelId: 0,
      socket: null,
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
