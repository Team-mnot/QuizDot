import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { LobbyInfo } from '../api/types';
import { enterLobbyApi } from '../api/api';

export function useLobbyQuery(channelId: number): {
  data: LobbyInfo;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: LobbyInfo = {
    channelId: -1,
    activeUserDtos: [],
    roomInfoDtos: [],
  };

  const {
    data = fallback,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['enterLobby'],
    queryFn: () => enterLobbyApi(channelId),
    staleTime: 3000,
    gcTime: 3000,
    placeholderData: keepPreviousData,
  });

  return { data, isError, isLoading };
}
