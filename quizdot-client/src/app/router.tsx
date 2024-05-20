import { createBrowserRouter } from 'react-router-dom';

import { MainPage } from '@/pages/main';
import { SignUpPage } from '@/pages/signUp';
import { LoginPage } from '@/pages/logIn';
import { FindPwdPage } from '@/pages/findPwd';
import { ResetPwdPage } from '@/pages/resetPwd';
import { ChannelPage } from '@/pages/channel';
import { LobbyPage } from '@/pages/lobby';
import { MultiPage } from '@/pages/multi';
import { SurvivalPage } from '@/pages/survival';
import { IlgitoPage } from '@/pages/ilgito';
import { WaitingRoomPage } from '@/pages/waitingRoom';
import { InvitingLinkPage } from '@/pages/invitingLink';
import { WebSocketProvider } from '@/shared/utils/WebSocketProvider.tsx';

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
    path: '/reset-pwd',
    element: <ResetPwdPage />,
  },
  {
    path: '/channel',
    element: (
      <WebSocketProvider>
        <ChannelPage />
      </WebSocketProvider>
    ),
  },
  {
    path: '/:channelId/lobby',
    element: (
      <WebSocketProvider>
        <LobbyPage />
      </WebSocketProvider>
    ),
  },
  {
    path: '/:channelId/:roomId/waiting',
    element: (
      <WebSocketProvider>
        <WaitingRoomPage />
      </WebSocketProvider>
    ),
  },
  {
    path: '/:channelId/:roomId/normal',
    element: (
      <WebSocketProvider>
        <MultiPage />
      </WebSocketProvider>
    ),
  },
  {
    path: '/:channelId/:roomId/survival',
    element: (
      <WebSocketProvider>
        <SurvivalPage />
      </WebSocketProvider>
    ),
  },
  {
    path: '/:channelId/:roomId/ilgito',
    element: (
      <WebSocketProvider>
        <IlgitoPage />
      </WebSocketProvider>
    ),
  },
  {
    path: '/invite',
    element: <InvitingLinkPage />,
  },
]);
