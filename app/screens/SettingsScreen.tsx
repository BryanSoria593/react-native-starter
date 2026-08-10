import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { useTranslation } from '@shared/i18n';
import { AppButton, AppText, AppScreen, AppCard } from '@shared/ui';
import { colors, spacing, useTheme } from '@shared/theme';

export function SettingsScreen() {
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleColorScheme } = useTheme();

  return (
    <AppScreen>
      <AppText variant="h1">{t('settings.title')}</AppText>

      <AppCard style={styles.row}>
        <AppText variant="body">{t('settings.darkMode')}</AppText>
        <Switch
          value={isDark}
          onValueChange={toggleColorScheme}
          trackColor={{ false: colors.gray300, true: colors.violet500 }}
          thumbColor={colors.white}
        />
      </AppCard>

      <View style={styles.section}>
        <AppText variant="caption" color={colors.gray500}>
          {t('settings.language')}
        </AppText>
        <View style={styles.languageButtons}>
          <View style={styles.languageButton}>
            <AppButton
              label={`🇪🇸 ${t('settings.spanish')}`}
              intent={locale === 'es' ? 'primary' : 'outlined'}
              onPress={() => setLocale('es')}
            />
          </View>
          <View style={styles.languageButton}>
            <AppButton
              label={`🇬🇧 ${t('settings.english')}`}
              intent={locale === 'en' ? 'primary' : 'outlined'}
              onPress={() => setLocale('en')}
            />
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: { gap: spacing.small },
  languageButtons: { flexDirection: 'row', gap: spacing.small },
  languageButton: { flex: 1 },
});
