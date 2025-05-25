
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Cpu } from 'lucide-react';

interface WorkflowStatusProps {
  isRunning: boolean;
  currentStepName?: string;
  lastExecutionTime: Date | null;
  quantumEnabled: boolean;
}

export function WorkflowStatus({ 
  isRunning, 
  currentStepName, 
  lastExecutionTime,
  quantumEnabled
}: WorkflowStatusProps) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex justify-between items-center text-xs text-zinc-400">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${isRunning ? 'bg-purple-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-zinc-300">
            {isRunning ? `Processing: ${currentStepName}` : 'Ready'}
          </span>
        </div>
        {lastExecutionTime && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-zinc-500" />
            <span className="text-zinc-400">Last run: {lastExecutionTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
      
      {quantumEnabled && (
        <div className="flex items-center text-xs text-purple-300">
          <Cpu className="h-3 w-3 mr-1" />
          <span>Quantum processing enabled</span>
        </div>
      )}
    </div>
  );
}
