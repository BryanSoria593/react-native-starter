import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton, AppText, AppCard } from '@shared/ui';
import { useTodoStats } from '../../shared/hooks/useTodoStats';
import { colors, spacing } from '@shared/theme';

interface StepSummaryProps {
  onBackClick: () => void;
}

export function StepSummary({ onBackClick }: StepSummaryProps) {
  const stats = useTodoStats();

  return (
    <View style={styles.container}>
      <AppText variant="h1">Summary</AppText>

      <AppCard>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <AppText variant="caption">Total TODOs</AppText>
            <AppText variant="h2" style={styles.statValue}>
              {stats.total}
            </AppText>
          </View>

          <View style={styles.statItem}>
            <AppText variant="caption">Completed</AppText>
            <AppText variant="h2" style={{ color: colors.success600 }}>
              {stats.completed}
            </AppText>
          </View>

          <View style={styles.statItem}>
            <AppText variant="caption">Active</AppText>
            <AppText variant="h2" style={{ color: colors.error600 }}>
              {stats.active}
            </AppText>
          </View>

          <View style={styles.statItem}>
            <AppText variant="caption">Progress</AppText>
            <AppText variant="h2" style={{ color: colors.cyan600 }}>
              {stats.completionPercentage}%
            </AppText>
          </View>
        </View>
      </AppCard>

      <AppButton label="Back to TODOs" onPress={onBackClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.large,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.medium,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: spacing.small,
  },
  statValue: {
    marginTop: spacing.small,
  },
});
