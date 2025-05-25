
import { useEffect } from 'react';
import { useSocketConnection } from './socket/useSocketConnection';
import { useSocketEventHandlers } from './socket/useSocketEventHandlers';
import { workflowOrchestratorService } from '@/lib/quantum/orchestrator/services/workflow-orchestrator.service';
import { UseWorkflowOrchestratorOptions } from '../useWorkflowOrchestrator';

export function useWorkflowSocket(
  options: UseWorkflowOrchestratorOptions,
  refreshWorkflows: () => void
) {
  // Initialize socket connection
  const { socket, isConnected, error } = useSocketConnection({
    autoConnect: options.enableRealTimeUpdates,
    onConnect: () => {
      console.log('Workflow socket connected');
    },
    onDisconnect: () => {
      console.log('Workflow socket disconnected');
    },
    onError: (error) => {
      console.error('Workflow socket error:', error);
      options.onError?.(error.message);
    }
  });

  // Set up event handlers
  useSocketEventHandlers(socket, {
    onWorkflowUpdate: (data) => {
      console.log('Workflow update received:', data);
      refreshWorkflows();
    },
    onStepComplete: (data) => {
      console.log('Step completed:', data);
      options.onStepComplete?.(data.workflowId, data.stepId, data.result);
    },
    onError: (error) => {
      console.error('Socket event error:', error);
      options.onError?.(error);
    }
  });

  // Update orchestrator service with socket
  useEffect(() => {
    workflowOrchestratorService.setSocket(socket);
  }, [socket]);

  return {
    socket,
    isConnected,
    error
  };
}
