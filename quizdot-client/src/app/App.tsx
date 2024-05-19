import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRef, useState } from 'react';
import { Button } from '@/shared/ui';

const queryClient = new QueryClient();

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={true} />
        <audio ref={audioRef} src="sounds/jazzyfrenchy.mp3" autoPlay loop />
        <Button
          onClick={toggleAudio}
          value={isPlaying ? '노래 꺼!' : '노래 켜!'}
          className="absolute right-4 top-4"
        />
      </QueryClientProvider>
    </div>
  );
}

export default App;
