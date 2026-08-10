import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton, AppText } from '@shared/ui';
import { useTodosSessionStore } from '../../shared/store';
import { useTodoStats } from '../../shared/hooks/useTodoStats';
import { TodoList as TodoListComponent } from './components/TodoList';
import { radii, semantic, spacing, useTheme } from '@shared/theme';

interface StepListProps {
  onAddClick: () => void;
}

export function StepList({ onAddClick }: StepListProps) {
  const todos = useTodosSessionStore((state) => state.todos);
  const stats = useTodoStats();
  const getFilteredTodos = useTodosSessionStore((state) => state.getFilteredTodos);
  const { isDark } = useTheme();
  const statBoxBackground = isDark ? semantic.dark.surfaceSecondary : semantic.light.surface;

  const filteredTodos = getFilteredTodos();

  return (
    <View style={styles.container}>
      <AppText variant="h1">My TODOs</AppText>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: statBoxBackground }]}>
          <AppText variant="caption">Total</AppText>
          <AppText variant="h2">{stats.total}</AppText>
        </View>
        <View style={[styles.statBox, { backgroundColor: statBoxBackground }]}>
          <AppText variant="caption">Completed</AppText>
          <AppText variant="h2">{stats.completed}</AppText>
        </View>
        <View style={[styles.statBox, { backgroundColor: statBoxBackground }]}>
          <AppText variant="caption">Progress</AppText>
          <AppText variant="h2">{stats.completionPercentage}%</AppText>
        </View>
      </View>

      <TodoListComponent todos={filteredTodos} />

      <AppButton label="+ Add TODO" onPress={onAddClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.large,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.medium,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.medium,
    borderRadius: radii.medium,
  },
});
