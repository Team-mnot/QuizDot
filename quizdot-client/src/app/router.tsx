import { createBrowserRouter } from 'react-router-dom';

import { MainPage } from '@/pages/main';
import { LobbyPage } from '@/pages/lobby';
import { MultiPage } from '@/pages/multi';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/lobby',
    element: <LobbyPage />,
  },
  {
    path: '/multi',
    element: <MultiPage />,
  },
]);
