import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { EnteringRoomInfo } from '../api/types';
import { EnterRoomApi } from '../api/api';

export function useEnterRoomQuery(roomId: number): {
  data: EnteringRoomInfo;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: EnteringRoomInfo = {
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
      isPublic: true,
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
