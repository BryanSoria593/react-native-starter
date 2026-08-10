import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '@shared/ui';
import { useTodosSessionStore } from '../../../shared/store';
import type { Todo } from '../../../shared/types';
import { colors, radii, semantic, spacing, typography, useTheme } from '@shared/theme';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useTodosSessionStore((state) => state.toggleTodo);
  const deleteTodo = useTodosSessionStore((state) => state.deleteTodo);
  const { isDark } = useTheme();
  const themeColors = isDark ? semantic.dark : semantic.light;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: themeColors.surfaceSecondary }]}
      onPress={() => toggleTodo(todo.id)}
    >
      <View style={[styles.checkbox, { borderColor: themeColors.border }]}>
        {todo.completed && <AppText style={styles.checkmark}>✓</AppText>}
      </View>

      <View style={styles.content}>
        <AppText
          variant="body"
          style={[styles.title, todo.completed && styles.completedText]}
        >
          {todo.title}
        </AppText>
        {todo.description && (
          <AppText variant="caption" color={themeColors.textSecondary}>
            {todo.description}
          </AppText>
        )}
      </View>

      <Pressable onPress={() => deleteTodo(todo.id)} style={styles.deleteButton}>
        <AppText style={styles.deleteText}>🗑</AppText>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medium,
    padding: spacing.medium,
    borderRadius: radii.small,
    marginBottom: spacing.small,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radii.small,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.success600,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.gray400,
  },
  deleteButton: {
    padding: spacing.small,
  },
  deleteText: {
    fontSize: typography.sizes.h4,
  },
});
