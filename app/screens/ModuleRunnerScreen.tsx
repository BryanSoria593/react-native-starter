// Suspense boundary supports lazy-loaded module components
import React, { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTranslation } from '@shared/i18n';
import { AppText } from '@shared/ui';
import { colors, spacing } from '@shared/theme';
import type { RootStackParamList } from '@shared/types/navigation.types';

import { getModule } from '../modules/moduleRegistry';

type ModuleRunnerScreenProps = NativeStackScreenProps<RootStackParamList, 'ModuleRunner'>;

export function ModuleRunnerScreen({ route, navigation }: ModuleRunnerScreenProps) {
  const { t } = useTranslation();
  const { moduleId } = route.params;
  const moduleDefinition = getModule(moduleId);

  if (!moduleDefinition) {
    return (
      <SafeAreaView style={styles.centered}>
        <View style={styles.messageBox}>
          <AppText variant="body" color={colors.error600}>
            {t('moduleRunner.moduleNotFound', { moduleId })}
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  const ModuleComponent = moduleDefinition.component;

  return (
    <Suspense fallback={<ModuleLoadingPlaceholder />}>
      <ModuleComponent onExit={() => navigation.goBack()} />
    </Suspense>
  );
}

function ModuleLoadingPlaceholder() {
  return (
    <SafeAreaView style={styles.centered}>
      <ActivityIndicator size="large" color={colors.gray400} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  messageBox: { padding: spacing.large },
});
