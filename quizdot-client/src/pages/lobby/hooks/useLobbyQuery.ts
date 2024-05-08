import { useQuery } from '@tanstack/react-query';
import { LobbyInfo } from '../api/types';
import { enterLobbyApi } from '../api/api';

export function useLobbyQuery(channelId: number): {
  data: LobbyInfo;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: LobbyInfo = {
    channelId: channelId,
    activeUsersInfo: [],
    roomsInfo: [],
  };

  const {
    data = fallback,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['enterLobby'],
    queryFn: () => enterLobbyApi(channelId),
  });

  console.log(error);

  return { data, isError, isLoading };
}
