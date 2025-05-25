
export const SOCKET_SERVER_URL = 'ws://localhost:3001';

export const SOCKET_EVENTS = {
  WORKFLOW_COMPLETED: 'workflowCompleted',
  STEP_COMPLETE: 'stepComplete',
  ERROR: 'error',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect'
} as const;
