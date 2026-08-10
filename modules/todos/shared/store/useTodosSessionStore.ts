import { create } from 'zustand';
import type { Todo, TodoFilter, TodosSessionState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TodosSessionActions {
  addTodo: (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoFilter) => void;
  navigateToStep: (step: 'list' | 'add' | 'summary') => void;
  getFilteredTodos: () => Todo[];
}

export const useTodosSessionStore = create<TodosSessionState & TodosSessionActions>((set, get) => ({
  todos: [
    {
      id: '1',
      title: 'Learn React Native',
      description: 'Study React Native concepts',
      completed: false,
      createdAt: Date.now(),
      priority: 'high',
    },
    {
      id: '2',
      title: 'Build TODO app',
      completed: true,
      createdAt: Date.now(),
      priority: 'high',
    },
    {
      id: '3',
      title: 'Review code',
      completed: false,
      createdAt: Date.now(),
      priority: 'medium',
    },
  ],
  filter: 'all',
  currentStep: 'list',
  isLoading: false,

  addTodo: (title, description, priority = 'medium') => {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      priority,
    };

    set((state) => ({
      todos: [...state.todos, newTodo],
      currentStep: 'list',
    }));
  },

  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  },

  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  setFilter: (filter) => {
    set({ filter });
  },

  navigateToStep: (step) => {
    set({ currentStep: step });
  },

  getFilteredTodos: () => {
    const state = get();
    switch (state.filter) {
      case 'active':
        return state.todos.filter((t) => !t.completed);
      case 'completed':
        return state.todos.filter((t) => t.completed);
      case 'all':
      default:
        return state.todos;
    }
  },
}));
