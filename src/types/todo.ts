export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string;
}

export type FilterType = 'all' | 'completed' | 'incomplete';
export type DateFilter = 'all' | 'today' | 'upcoming' | 'overdue';
