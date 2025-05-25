
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketConnectionOptions {
  url?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useSocketConnection(options: UseSocketConnectionOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const {
    url = 'ws://localhost:3001',
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError
  } = options;

  useEffect(() => {
    if (!autoConnect) return;

    try {
      socketRef.current = io(url, {
        transports: ['websocket'],
        timeout: 5000,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        setError(null);
        onConnect?.();
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        onDisconnect?.();
      });

      socketRef.current.on('connect_error', (err) => {
        setError(err.message);
        setIsConnected(false);
        onError?.(err);
      });

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Socket connection failed');
      setError(error.message);
      onError?.(error);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url, autoConnect, onConnect, onDisconnect, onError]);

  const connect = () => {
    if (!socketRef.current) {
      socketRef.current = io(url);
    } else {
      socketRef.current.connect();
    }
  };

  const disconnect = () => {
    socketRef.current?.disconnect();
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect
  };
}
