export interface TaskFormValues {
  title: string;
  description: string;
  due_date: string;
  priority: string;
  source?: string;
  source_id?: string;
}

export interface TaskFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<TaskFormValues>;
  source?: string;
  sourceId?: string;
}