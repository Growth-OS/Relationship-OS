export interface ProjectFormData {
  name: string;
  client_name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold';
  start_date?: Date;
  end_date?: Date;
  budget?: number;
}