// Architect Loop - Meta-orchestration layer
// Processes meta_tasks from Supabase and dispatches to agent squads

import { windmillClient } from './windmillClient';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';
export type TaskStatus = 'pending' | 'dispatched' | 'running' | 'completed' | 'failed';

export interface MetaTask {
  id: string;
  instruction: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedAgents: string[];
  createdAt: string;
  completedAt?: string;
  result?: string;
}

export interface MetaEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  source: string;
  message: string;
}

// Process incoming meta_task from Supabase Realtime
export const processMetaTask = async (task: MetaTask): Promise<void> => {
  console.log(`[ARCHITECT] Processing task: ${task.instruction} (${task.priority})`);
  
  // Route to appropriate Windmill script based on task content
  const scriptPath = resolveScript(task.instruction);
  
  await windmillClient.execute(scriptPath, {
    task_id: task.id,
    instruction: task.instruction,
    priority: task.priority,
  });
};

// Resolve which Windmill script handles a given instruction
const resolveScript = (instruction: string): string => {
  const lower = instruction.toLowerCase();
  if (lower.includes('scan') || lower.includes('scrape')) return 'f/scouts/run_scan';
  if (lower.includes('email') || lower.includes('campaign')) return 'f/email_ops/send_campaign';
  if (lower.includes('analyze') || lower.includes('eval')) return 'f/analytics/run_eval';
  if (lower.includes('deploy')) return 'f/infra/deploy_agent';
  if (lower.includes('compliance') || lower.includes('gdpr')) return 'f/sentinel/check_compliance';
  return 'f/architect/generic_task';
};

// Generate meta_event for the activity feed
export const emitEvent = (type: MetaEvent['type'], source: string, message: string): MetaEvent => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  type,
  source,
  message,
});
