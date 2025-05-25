
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWorkflowOrchestrator } from '@/hooks/useWorkflowOrchestrator';
import { WorkflowStepDefinition } from '@/lib/quantum/workflow/types/WorkflowStepTypes';
import { projectMarinerRealtimeService, MarinerWorkflowProgress } from '@/services/realtime/ProjectMarinerRealtimeService';

export function useMarinerWorkflow() {
  const [marinerWorkflowId, setMarinerWorkflowId] = useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [realtimeProgress, setRealtimeProgress] = useState<MarinerWorkflowProgress | null>(null);
  
  const { 
    createWorkflow,
    startWorkflow,
    createWorkflowStep,
    getWorkflowDetails,
    activeWorkflowSteps,
    stepResults,
    isLoading,
    error,
  } = useWorkflowOrchestrator({
    autoConnect: true,
    enableRealTimeUpdates: true,
    onWorkflowComplete: (workflowId, results) => {
      toast.success('Project Mariner workflow completed!', {
        description: `All steps executed successfully.`
      });
      setWorkflowStatus('completed');
    },
    onStepComplete: (workflowId, stepId, result) => {
      if (workflowId === marinerWorkflowId) {
        toast.info(`Step completed: ${activeWorkflowSteps.find(step => step.id === stepId)?.name || stepId}`);
      }
    },
    onError: (error) => {
      toast.error('Workflow error', { description: error });
      setWorkflowStatus('failed');
    }
  });

  // Listen for real-time workflow updates
  useEffect(() => {
    const handleWorkflowStarted = (progress: MarinerWorkflowProgress) => {
      if (progress.workflowId === marinerWorkflowId) {
        setRealtimeProgress(progress);
        setWorkflowStatus('running');
      }
    };

    const handleWorkflowProgress = (progress: MarinerWorkflowProgress) => {
      if (progress.workflowId === marinerWorkflowId) {
        setRealtimeProgress(progress);
      }
    };

    const handleWorkflowCompleted = (progress: MarinerWorkflowProgress) => {
      if (progress.workflowId === marinerWorkflowId) {
        setRealtimeProgress(progress);
        setWorkflowStatus('completed');
      }
    };

    projectMarinerRealtimeService.on('workflowStarted', handleWorkflowStarted);
    projectMarinerRealtimeService.on('workflowProgress', handleWorkflowProgress);
    projectMarinerRealtimeService.on('workflowCompleted', handleWorkflowCompleted);

    return () => {
      projectMarinerRealtimeService.off('workflowStarted', handleWorkflowStarted);
      projectMarinerRealtimeService.off('workflowProgress', handleWorkflowProgress);
      projectMarinerRealtimeService.off('workflowCompleted', handleWorkflowCompleted);
    };
  }, [marinerWorkflowId]);

  // Initialize Project Mariner workflow
  const createMarinerWorkflow = async (): Promise<string> => {
    // Define workflow steps
    const marinerSteps: WorkflowStepDefinition[] = [
      createWorkflowStep('System Initialization', 'agiPlan', {
        objective: 'Initialize Mariner systems',
        priority: 'high'
      }),
      createWorkflowStep('Quantum Security Protocol', 'quantumCoin', {
        algorithm: 'QRNG-enhanced',
        encryptionLevel: 'maximum'
      }),
      createWorkflowStep('Navigation System Calibration', 'analysis', {
        dataSource: 'stellarCartography',
        precision: 'high'
      }),
      createWorkflowStep('Deep Space Communication', 'quantum', {
        entangledPairs: 128,
        coherenceTarget: 0.99
      }),
      createWorkflowStep('Marine Life Analysis', 'genomicsVerify', {
        sequenceDepth: 'full',
        species: 'marineVertebrates'
      }),
      createWorkflowStep('Ocean Current Analysis', 'mlInfer', {
        modelId: 'oceanography-v2',
        dataPoints: 5000
      }),
      createWorkflowStep('Trajectory Calculation', 'mlTrain', {
        modelId: 'trajectory-predictor',
        epochs: 50
      }),
      createWorkflowStep('Mission Data Storage', 'bigData', {
        storage: 'quantum-resilient',
        redundancy: 3
      }),
      createWorkflowStep('Results Publishing', 'gitCommit', {
        path: 'results/mariner/${timestamp}.json',
        branch: 'mission-data'
      })
    ];

    // Create the workflow
    const workflow = await createWorkflow({
      name: "Project Mariner Exploration Workflow",
      steps: marinerSteps,
      metadata: {
        project: 'Mariner',
        version: '1.0.0',
        classification: 'deep-ocean-exploration'
      }
    });

    const workflowId = workflow.id;
    setMarinerWorkflowId(workflowId);
    return workflowId;
  };

  // Start the workflow
  const launchMarinerWorkflow = async () => {
    let workflowId = marinerWorkflowId;
    
    if (!workflowId) {
      workflowId = await createMarinerWorkflow();
    }
    
    const started = await startWorkflow(workflowId);
    if (started) {
      setWorkflowStatus('running');
      
      // Start real-time monitoring
      projectMarinerRealtimeService.startMarinerWorkflow(workflowId, "Project Mariner Exploration Workflow");
      
      toast.info('Project Mariner workflow started', {
        description: 'Initializing deep ocean exploration systems'
      });
    }
  };

  // Load workflow details if available
  useEffect(() => {
    if (marinerWorkflowId) {
      getWorkflowDetails(marinerWorkflowId);
    }
  }, [marinerWorkflowId, getWorkflowDetails]);

  return {
    marinerWorkflowId,
    workflowStatus,
    realtimeProgress,
    activeWorkflowSteps,
    stepResults,
    isLoading,
    error,
    launchMarinerWorkflow
  };
}
