export function validateCredentials(username: string, password: string): string | null {
  if (!username.trim()) {
    return 'Username is required';
  }

  if (!password) {
    return 'Password is required';
  }

  if (password.length < 4) {
    return 'Password must be at least 4 characters';
  }

  return null;
}
