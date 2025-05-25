
import { useCallback } from 'react';
import { toast } from 'sonner';
import { 
  workflowOrchestratorService, 
  WorkflowConfig 
} from '@/lib/quantum/orchestrator/services/workflow-orchestrator.service';
import { UseWorkflowOrchestratorOptions } from '../useWorkflowOrchestrator';

export function useWorkflowActions(state: any, options: UseWorkflowOrchestratorOptions) {
  // Create a new workflow
  const createWorkflow = useCallback(async (config: WorkflowConfig) => {
    try {
      state.updateState({ isLoading: true, error: null });
      
      const workflow = workflowOrchestratorService.createWorkflow(config);
      
      toast.success(`Workflow "${workflow.name}" created successfully`);
      
      // Update state with new workflow ID as string
      state.updateState({ 
        activeWorkflowId: workflow.id,
        isLoading: false 
      });
      
      state.refreshWorkflows();
      
      return workflow;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create workflow';
      state.updateState({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      throw error;
    }
  }, [state, options]);

  // Execute a workflow
  const executeWorkflow = useCallback(async (workflowId: string) => {
    try {
      state.updateState({ isLoading: true, error: null });
      
      await workflowOrchestratorService.executeWorkflow(workflowId);
      
      toast.success('Workflow execution completed');
      state.refreshWorkflows();
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Workflow execution failed';
      state.updateState({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      return false;
    }
  }, [state, options]);

  // Cancel workflow (placeholder implementation)
  const cancelWorkflow = useCallback(async (workflowId: string) => {
    try {
      console.log(`Cancelling workflow: ${workflowId}`);
      toast.info('Workflow cancellation requested');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel workflow';
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      return false;
    }
  }, [options]);

  // Delete a workflow
  const deleteWorkflow = useCallback(async (workflowId: string) => {
    try {
      state.updateState({ isLoading: true, error: null });
      
      const deleted = workflowOrchestratorService.deleteWorkflow(workflowId);
      
      if (deleted) {
        toast.success('Workflow deleted successfully');
        state.refreshWorkflows();
        
        // Clear active workflow if it was deleted
        if (state.activeWorkflowId === workflowId) {
          state.updateState({ activeWorkflowId: null });
        }
      } else {
        throw new Error('Workflow not found');
      }
      
      return deleted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete workflow';
      state.updateState({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      return false;
    }
  }, [state, options]);

  // Retry workflow (placeholder implementation)  
  const retryWorkflow = useCallback(async (workflowId: string) => {
    try {
      console.log(`Retrying workflow: ${workflowId}`);
      return await executeWorkflow(workflowId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retry workflow';
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      return false;
    }
  }, [executeWorkflow, options]);

  // Get workflow results (placeholder implementation)
  const getWorkflowResults = useCallback(async (workflowId: string) => {
    try {
      const workflow = workflowOrchestratorService.getWorkflow(workflowId);
      
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      
      return {
        workflowId,
        status: workflow.status,
        steps: workflow.steps,
        results: workflow.steps.map(step => step.output).filter(Boolean)
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get workflow results';
      options.onError?.(errorMessage);
      throw error;
    }
  }, [options]);

  return {
    createWorkflow,
    executeWorkflow,
    cancelWorkflow,
    deleteWorkflow,
    retryWorkflow,
    getWorkflowResults
  };
}
