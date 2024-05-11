import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { EnterRoomApi } from '../api/api';
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
    queryFn: () => EnterRoomApi(roomId),
    staleTime: 3000,
    gcTime: 3000,
    placeholderData: keepPreviousData,
  });

  return { data, isError, isLoading };
}
