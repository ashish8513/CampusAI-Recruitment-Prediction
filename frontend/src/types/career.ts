export interface CompanyOption {
  id: string;
  name: string;
}

export interface SkillGap {
  skill: string;
  severity: string;
  recommendation: string;
}

export interface ResumeMatchResult {
  company: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  skill_gaps: SkillGap[];
  gd_topics: string[];
  interview_focus: string[];
  verdict: string;
  mode?: string;
}

export interface ScoreCategory {
  score: number;
  label: string;
  feedback: string;
}

export interface ResumeScoreResult {
  overall_score: number;
  grade: string;
  categories: Record<string, ScoreCategory>;
  improvements: string[];
  mode?: string;
}

export interface InterviewPrepResult {
  company: string;
  match_percentage: number;
  hr_questions: string[];
  technical_questions: string[];
  gd_preparation: string[];
  interview_checklist: string[];
  focus_areas: string[];
  mode?: string;
}
