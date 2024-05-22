//src/pages/survival/hooks/websocketProvider.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'; //

interface WebSocketContextValue {
  nextQuizSignal: boolean;
  setNextQuizSignal: (value: boolean) => void;
}

const WEBSOCKET_URL = 'wss://example.com/websocket';
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === null)
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

function WebSocketProvider(props: WebSocketProviderProps) {
  const [nextQuizSignal, setNextQuizSignal] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(WEBSOCKET_URL);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEXT_QUIZ') {
        setNextQuizSignal(true);
      }
    };

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ nextQuizSignal, setNextQuizSignal }}>
      {props.children}
    </WebSocketContext.Provider>
  );
}

export { WebSocketProvider };
