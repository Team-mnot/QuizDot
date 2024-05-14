import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { Response } from '@/shared/apis/types';

type RequestFn<T> = (params: T) => Promise<Response>;

export const useAxios = <T>(requestFn: RequestFn<T>, params: T) => {
  const [response, setResponse] = useState<Response>();
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setResponse(undefined);
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await requestFn(params);
      setResponse(response.data);
    } catch (error) {
      setError(error as AxiosError);
    }
    setIsLoading(false);
  };

  const sendRequest = async () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response, error, isLoading, sendRequest };
};
