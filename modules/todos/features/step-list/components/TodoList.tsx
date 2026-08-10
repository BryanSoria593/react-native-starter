import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { AppText } from '@shared/ui';
import { TodoItem } from './TodoItem';
import type { Todo } from '../../../shared/types';
import { colors, spacing } from '@shared/theme';

interface TodoListProps {
  todos: Todo[];
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyState}>
        <AppText variant="h2">No TODOs yet</AppText>
        <AppText variant="body" style={styles.emptyText}>
          Add your first TODO to get started
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      scrollEnabled={false}
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TodoItem todo={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.extraLarge,
    gap: spacing.small,
  },
  emptyText: {
    color: colors.gray500,
  },
  separator: {
    height: spacing.small,
  },
});
