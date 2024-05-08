import { useQuery } from '@tanstack/react-query';
import { LobbyInfo } from '../api/types';
import { enterLobbyApi } from '../api/api';

export function useLobbyQuery(channelId: number): {
  data: LobbyInfo;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: LobbyInfo = {
    channelId: 8,
    activeUsersInfo: [],
    roomsInfo: [],
  };

  const {
    data = fallback,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['enterLobby'],
    queryFn: () => enterLobbyApi(channelId),
  });

  return { data, isError, isLoading };
}
