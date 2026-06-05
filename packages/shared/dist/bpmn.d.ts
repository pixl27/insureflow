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
export declare class BpmnEngine {
    /**
     * Evaluate a simple logical condition string against a data context safely.
     */
    private evaluateCondition;
    /**
     * Run a workflow from a starting step using context data and log trace.
     */
    run(workflow: BpmnWorkflow, context: Record<string, any>, startStepId?: string): {
        completed: boolean;
        currentStepId: string | null;
        trace: string[];
    };
}
