
import { v4 as uuidv4 } from 'uuid';
import type { Socket } from 'socket.io-client';

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
  error?: string;
  dependencies?: string[];
}

export interface WorkflowConfig {
  name: string;
  steps: Omit<WorkflowStep, 'id' | 'status'>[];
  metadata?: Record<string, any>;
}

class WorkflowOrchestratorService {
  private workflows: Map<string, Workflow> = new Map();
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    // Initialize the workflow orchestrator
  }

  setSocket(socket: Socket | null) {
    this.socket = socket;
  }

  createWorkflow(config: WorkflowConfig): Workflow {
    const workflow: Workflow = {
      id: uuidv4(),
      name: config.name,
      steps: config.steps.map(step => ({
        ...step,
        id: uuidv4(),
        status: 'pending'
      })),
      status: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: config.metadata
    };

    this.workflows.set(workflow.id, workflow);
    this.emit('workflow:created', { workflow });
    return workflow;
  }

  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    workflow.status = 'running';
    workflow.updatedAt = new Date();
    this.emit('workflow:started', { workflow });

    try {
      for (const step of workflow.steps) {
        await this.executeStep(workflow, step);
      }

      workflow.status = 'completed';
      this.emit('workflow:completed', { workflow });
    } catch (error) {
      workflow.status = 'failed';
      this.emit('workflow:failed', { workflow, error });
      throw error;
    } finally {
      workflow.updatedAt = new Date();
    }
  }

  private async executeStep(workflow: Workflow, step: WorkflowStep): Promise<void> {
    step.status = 'running';
    this.emit('step:started', { workflow, step });

    try {
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      step.status = 'completed';
      step.output = { result: 'success', timestamp: Date.now() };
      this.emit('step:completed', { workflow, step });
    } catch (error) {
      step.status = 'failed';
      step.error = error instanceof Error ? error.message : 'Unknown error';
      this.emit('step:failed', { workflow, step, error });
      throw error;
    }
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  deleteWorkflow(id: string): boolean {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      this.emit('workflow:deleted', { workflowId: id });
    }
    return deleted;
  }

  // Event system
  on(event: string, listener: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(data));

    // Emit to socket if connected
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const workflowOrchestratorService = new WorkflowOrchestratorService();
