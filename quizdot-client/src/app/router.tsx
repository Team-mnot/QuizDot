import { createBrowserRouter } from 'react-router-dom';

import { MainPage } from '@/pages/main';
import { LobbyPage } from '@/pages/lobby';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/lobby',
    element: <LobbyPage />,
  },
]);
