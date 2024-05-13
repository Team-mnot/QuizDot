import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WebSocketProvider } from '../shared/utils/WebSocketProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </WebSocketProvider>
    </div>
  );
}

export default App;
