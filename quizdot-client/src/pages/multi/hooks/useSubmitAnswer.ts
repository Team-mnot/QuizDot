import { baseApi } from '@/shared/apis';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { useEffect, useState } from 'react';

export const useSubmitAnswer = (
  roomId: number,
  category: string,
  mode: string,
) => {
  const [response, setResponse] = useState<Response | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const sendRequest = async () => {
    setResponse(null);
    setIsError(null);
    setIsLoading(true);
    try {
      const response = await jwtAxiosInstance.get(
        `${baseApi}/game/quiz/${roomId}/${category}/${mode}`,
      );
      if (response.data.status == 200) {
        setResponse(response.data);
      } else {
      }
      if (response.data.status != 200) {
        throw new Error(response.data.error);
      }
    } catch (err) {
      if (err instanceof Error) {
        setIsError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    sendRequest();
  }, []);

  return { response, isLoading, isError };
};
