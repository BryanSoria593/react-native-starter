export function validateTodo(title: string): string | null {
  if (!title.trim()) {
    return 'Title is required';
  }

  if (title.length < 3) {
    return 'Title must be at least 3 characters';
  }

  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }

  return null;
}
