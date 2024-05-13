import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { enterRoomApi } from '../api/api';
import { EnteringRoomType } from '../api/types';

export function useEnterRoomQuery(roomId: number): {
  data: EnteringRoomType;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: EnteringRoomType = {
    players: {},
    roomInfo: {
      roomId: -1,
      title: '',
      password: '',
      gameMode: '',
      maxPeople: -1,
      category: '',
      maxQuestion: -1,
      hostId: -1,
      inviteLink: null,
      state: '',
      open: true,
    },
  };

  const {
    data = fallback,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['enterRoom'],
    queryFn: () => enterRoomApi(roomId),
    staleTime: 30000,
    gcTime: 30000,
    placeholderData: keepPreviousData,
  });

  return { data, isError, isLoading };
}
