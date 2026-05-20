export interface PredictPayload {
  gender: number;
  ssc_p: number;
  ssc_b: number;
  hsc_p: number;
  hsc_b: number;
  hsc_s: string;
  degree_p: number;
  degree_t: string;
  workex: number;
  etest_p: number;
  specialisation: number;
  mba_p: number;
  status: number;
}

export interface PredictResult {
  predicted_salary: number;
  placement_status: string;
  currency: string;
  confidence_band?: string;
}

export interface Analytics {
  total_students: number;
  placed_count: number;
  placement_rate: number;
  avg_salary: number;
  max_salary: number;
  min_salary: number;
}

export interface ChatResponse {
  reply: string;
  mode: string;
  sources?: number;
}

export interface AgentPlan {
  goal: string;
  readiness_score: number;
  action_plan: string;
  agent_steps: { step: string; detail: string }[];
  mode: string;
}
