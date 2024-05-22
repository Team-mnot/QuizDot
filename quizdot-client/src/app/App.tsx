import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
    <div className="flex items-center justify-center w-screen h-screen">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        <audio ref={audioRef} src="sounds/jazzyfrenchy.mp3" autoPlay loop />
        <Button
          onClick={toggleAudio}
          value={isPlaying ? '🔈' : '🔊'}
          className="absolute bottom-0 right-0 z-50 cursor-pointer text-border custom-blinking custom-btn-transparent"
        />
      </QueryClientProvider>
    </div>
  );
}

export default App;
