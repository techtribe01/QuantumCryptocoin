
import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';

interface UseSocketEventHandlersOptions {
  onWorkflowUpdate?: (data: any) => void;
  onStepComplete?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useSocketEventHandlers(
  socket: Socket | null,
  options: UseSocketEventHandlersOptions = {}
) {
  const { onWorkflowUpdate, onStepComplete, onError } = options;

  useEffect(() => {
    if (!socket) return;

    const handleWorkflowUpdate = (data: any) => {
      onWorkflowUpdate?.(data);
    };

    const handleStepComplete = (data: any) => {
      onStepComplete?.(data);
    };

    const handleError = (error: string) => {
      onError?.(error);
    };

    socket.on('workflow:update', handleWorkflowUpdate);
    socket.on('step:complete', handleStepComplete);
    socket.on('error', handleError);

    return () => {
      socket.off('workflow:update', handleWorkflowUpdate);
      socket.off('step:complete', handleStepComplete);
      socket.off('error', handleError);
    };
  }, [socket, onWorkflowUpdate, onStepComplete, onError]);
}
