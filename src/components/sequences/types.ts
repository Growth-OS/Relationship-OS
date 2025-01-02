export interface Sequence {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'completed';
  max_steps: number;
  sequence_steps: {
    count: number;
  }[];
  sequence_assignments: {
    id: string;
    status: string;
    current_step: number;
    prospect: {
      company_name: string;
    };
  }[];
}