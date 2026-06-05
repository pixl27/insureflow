export interface BpmnStep {
  id: string;
  name: string;
  type: 'AUTOMATIC_TASK' | 'USER_TASK';
  action?: string;
  assigneeRole?: string;
  next: string | null | {
    condition: string;
    true: string;
    false: string;
  };
}

export interface BpmnWorkflow {
  name: string;
  version: string;
  trigger: string;
  steps: BpmnStep[];
}

export class BpmnEngine {
  /**
   * Evaluate a simple logical condition string against a data context safely.
   */
  private evaluateCondition(condition: string, context: Record<string, any>): boolean {
    const match = condition.match(/(\w+)\s*(>|<|==|!=)\s*(.+)/);
    if (!match) return false;

    const [_, variable, operator, valStr] = match;
    const contextVal = context[variable];
    
    // Parse compare value (number or string)
    const cleanedVal = valStr.trim().replace(/['"]/g, '');
    const compareVal = isNaN(Number(cleanedVal)) ? cleanedVal : Number(cleanedVal);

    if (contextVal === undefined) return false;

    switch (operator) {
      case '>': return Number(contextVal) > Number(compareVal);
      case '<': return Number(contextVal) < Number(compareVal);
      case '==': return contextVal == compareVal;
      case '!=': return contextVal != compareVal;
      default: return false;
    }
  }

  /**
   * Run a workflow from a starting step using context data and log trace.
   */
  public run(workflow: BpmnWorkflow, context: Record<string, any>, startStepId?: string): {
    completed: boolean;
    currentStepId: string | null;
    trace: string[];
  } {
    const trace: string[] = [];
    const stepsMap = new Map<string, BpmnStep>();
    for (const step of workflow.steps) {
      stepsMap.set(step.id, step);
    }

    let currentStepId = startStepId || (workflow.steps.length > 0 ? workflow.steps[0].id : null);
    
    if (!currentStepId) {
      return { completed: true, currentStepId: null, trace };
    }

    while (currentStepId) {
      const step = stepsMap.get(currentStepId);
      if (!step) {
        trace.push(`Error: Step ${currentStepId} not found in workflow`);
        break;
      }

      trace.push(`Executing: [${step.type}] ${step.name} (ID: ${step.id})`);

      // If it's a User Task, pause execution (require human approval/validation)
      if (step.type === 'USER_TASK') {
        trace.push(`Paused: Awaiting role ${step.assigneeRole || 'SYSTEM'} action`);
        return { completed: false, currentStepId, trace };
      }

      // Handle step transition
      const nextStep = step.next;
      if (!nextStep) {
        currentStepId = null; // Completed
      } else if (typeof nextStep === 'string') {
        currentStepId = nextStep;
      } else {
        // Conditional block
        const conditionResult = this.evaluateCondition(nextStep.condition, context);
        trace.push(`Condition check: "${nextStep.condition}" evaluated to ${conditionResult}`);
        currentStepId = conditionResult ? nextStep.true : nextStep.false;
      }
    }

    trace.push('Workflow completed successfully');
    return { completed: true, currentStepId: null, trace };
  }
}
