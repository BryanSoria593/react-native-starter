export interface Credentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  token: string;
}

export interface AuthSessionState {
  isLoading: boolean;
  currentStep: 'login' | 'register';
}
