import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppScreen } from '@shared/ui';
import { useTodosSessionStore } from '../shared/store';
import { StepList } from '../features/step-list';
import { StepAdd } from '../features/step-add';
import { StepSummary } from '../features/step-summary';

export function TodosFlow() {
  const { currentStep, navigateToStep } = useTodosSessionStore();

  return (
    <AppScreen>
      {currentStep === 'list' && (
        <StepList onAddClick={() => navigateToStep('add')} />
      )}
      {currentStep === 'add' && (
        <StepAdd onBackClick={() => navigateToStep('list')} />
      )}
      {currentStep === 'summary' && (
        <StepSummary onBackClick={() => navigateToStep('list')} />
      )}
    </AppScreen>
  );
}
