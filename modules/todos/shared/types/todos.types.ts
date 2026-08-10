export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  priority: 'low' | 'medium' | 'high';
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodosSessionState {
  todos: Todo[];
  filter: TodoFilter;
  currentStep: 'list' | 'add' | 'summary';
  isLoading: boolean;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionPercentage: number;
}
