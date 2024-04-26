import { createBrowserRouter } from 'react-router-dom';

import { MainPage } from '@/pages/main';
import { LobbyPage } from '@/pages/lobby';
import { MultiPage } from '@/pages/multi';
import { SurvivalPage } from '@/pages/survival';

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
  {
    path: '/survival',
    element: <SurvivalPage />,
  },
]);
