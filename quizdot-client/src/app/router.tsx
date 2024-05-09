import { createBrowserRouter } from 'react-router-dom';

import { MainPage } from '@/pages/main';
import { SignUpPage } from '@/pages/signUp';
import { LoginPage } from '@/pages/logIn';
import { FindPwdPage } from '@/pages/findPwd';
import { ChannelPage } from '@/pages/channel';
import { LobbyPage } from '@/pages/lobby';
import { MultiPage } from '@/pages/multi';
import { SurvivalPage } from '@/pages/survival';
import { WaitingRoomPage } from '@/pages/waitingRoom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/find-pwd',
    element: <FindPwdPage />,
  },
  {
    path: '/channel',
    element: <ChannelPage />,
  },
  {
    path: '/:channelId/lobby',
    element: <LobbyPage />,
  },
  {
    path: '/:channelId/multi',
    element: <MultiPage />,
  },
  {
    path: '/:roomId/waiting',
    element: <WaitingRoomPage />,
  },
  {
    path: ':roomId/survival',
    element: <SurvivalPage />,
  },
]);
