import { RoomInfoType } from '@/pages/lobby/api/types';
import { PlayerType, PlayersType } from '@/pages/waitingRoom/api/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RoomStore {
  roomInfo: RoomInfoType | null;
  fetchRoom: (roomInfo: RoomInfoType) => void;
  leaveRoom: () => void;

  players: PlayersType;
  fetchPlayers: (players: PlayersType) => void;
  enteredPlayer: (playerId: number, playerInfo: PlayerType) => void;
  leavedPlayer: (playerId: number) => void;

  reset: () => void;
}

const useRoomStore = create(
  persist<RoomStore>(
    (set) => ({
      roomInfo: null,
      fetchRoom: (roomInfo: RoomInfoType) => {
        set({ roomInfo });
      },
      leaveRoom: () => {
        set({ roomInfo: null });
      },
      players: {},
      fetchPlayers: (players: PlayersType) => {
        set({ players: players });
      },
      enteredPlayer: (playerId: number, playerInfo: PlayerType) => {
        set((state) => ({
          players: { ...state.players, [playerId]: playerInfo },
        }));
      },
      leavedPlayer: (playerId: number) => {
        set((state) => {
          const newPlayers = { ...state.players };
          delete newPlayers[playerId];
          return { players: newPlayers };
        });
      },
      reset: () => {
        set({ roomInfo: null, players: {} });
      },
    }),
    {
      name: 'roomStorage',
    },
  ),
);

export { useRoomStore };
