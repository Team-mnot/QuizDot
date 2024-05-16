import { RoomInfoType } from '@/pages/lobby/api/types';
import {
  PlayerType,
  PlayersType,
  ScoresType,
} from '@/pages/waitingRoom/api/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  roomInfo: RoomInfoType | null;
  fetchRoom: (roomInfo: RoomInfoType) => void;
  leaveRoom: () => void;

  players: PlayersType;
  fetchPlayers: (players: PlayersType) => void;
  enteredPlayer: (playerId: number, playerInfo: PlayerType) => void;
  leavedPlayer: (playerId: number) => void;

  scores: ScoresType;
  fetchScores: (playerId: number, score: number) => void;
  clearScores: () => void;

  reset: () => void;
}

const useGameStore = create(
  persist<GameStore>(
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

      scores: {},
      fetchScores: (playerId: number, score: number) => {
        set((state) => ({
          scores: { ...state.scores, [playerId]: score },
        }));
      },
      clearScores: () => {
        set({ scores: {} });
      },

      reset: () => {
        set({ roomInfo: null, players: {} });
      },
    }),
    {
      name: 'gameStorage',
    },
  ),
);

export { useGameStore };
