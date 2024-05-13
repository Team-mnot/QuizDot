import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { enterLobbyApi } from '../api/api';
import { LobbyInfoType } from '../api/types';

/*** 채널 로비 입장 Hook ***/
export function useLobbyQuery(channelId: number): {
  data: LobbyInfoType;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: LobbyInfoType = {
    channelId: -1,
    activeUsers: [],
    roomInfos: [],
  };

  const {
    data = fallback,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['enterLobby'],
    queryFn: () => enterLobbyApi(channelId),
    staleTime: 10000,
    gcTime: 10000,
    placeholderData: keepPreviousData,
  });

  return { data, isError, isLoading };
}
