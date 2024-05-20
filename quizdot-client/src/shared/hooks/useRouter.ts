import { useNavigate } from 'react-router-dom';

export const useRouter = () => {
  const router = useNavigate();

  return {
    currentPath: window.location.pathname,
    routeTo: (path: string) => router(path, { replace: true }),
    goBack: () => router(-1),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routeToWithData: (path: string, data: any) =>
      router(path, { state: data, replace: true }),
  };
};
