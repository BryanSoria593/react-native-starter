import { useMemo } from 'react';
import { useTodosSessionStore } from '../store';
import type { TodoStats } from '../types';

export function useTodoStats(): TodoStats {
  const todos = useTodosSessionStore((state) => state.todos);

  return useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionPercentage,
    };
  }, [todos]);
}
