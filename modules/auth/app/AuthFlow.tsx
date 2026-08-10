import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppScreen } from '@shared/ui';
import { useAuthSessionStore } from '../shared/store';
import { StepLogin } from '../features/step-login';
import { StepRegister } from '../features/step-register';

export function AuthFlow() {
  const { currentStep, navigateToStep } = useAuthSessionStore();

  return (
    <AppScreen>
      {currentStep === 'login' && (
        <StepLogin onRegisterClick={() => navigateToStep('register')} />
      )}
      {currentStep === 'register' && (
        <StepRegister onBackClick={() => navigateToStep('login')} />
      )}
    </AppScreen>
  );
}
