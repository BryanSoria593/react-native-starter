import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton, AppInput, AppText } from '@shared/ui';
import { useTodosSessionStore } from '../../shared/store';
import { validateTodo } from '../../shared/utils/validateTodo';
import { colors, spacing } from '@shared/theme';

interface StepAddProps {
  onBackClick: () => void;
}

export function StepAdd({ onBackClick }: StepAddProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState<string | null>(null);

  const addTodo = useTodosSessionStore((state) => state.addTodo);

  const handleAdd = () => {
    const validationError = validateTodo(title);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    addTodo(title, description || undefined, priority);
    onBackClick();
  };

  return (
    <View style={styles.container}>
      <AppText variant="h1">Add TODO</AppText>

      <AppInput
        placeholder="What needs to be done?"
        value={title}
        onChangeText={setTitle}
        multiline
      />

      <AppInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.priorityContainer}>
        <AppText variant="body">Priority:</AppText>
        <View style={styles.priorityButtons}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <AppButton
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              intent={priority === p ? 'primary' : 'secondary'}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>
      </View>

      {error && (
        <AppText variant="caption" color={colors.error600}>
          {error}
        </AppText>
      )}

      <AppButton label="Add TODO" onPress={handleAdd} />

      <AppButton label="Cancel" intent="secondary" onPress={onBackClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.medium,
  },
  priorityContainer: {
    gap: spacing.small,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: spacing.small,
  },
});
