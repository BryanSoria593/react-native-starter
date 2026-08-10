import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@shared/i18n';
import { AppButton, AppText, AppScreen, AppCard } from '@shared/ui';
import { colors, radii, spacing } from '@shared/theme';
import { useAuthStore } from '@shared/stores/useAuthStore';

export function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const usernameInitial = user?.username.charAt(0).toUpperCase() ?? '?';

  return (
    <AppScreen>
      <View style={styles.header}>
        <AppText variant="h1" style={styles.centeredText}>
          {t('profile.title')}
        </AppText>
      </View>

      <AppCard style={styles.userCard}>
        <View style={styles.avatar}>
          <AppText variant="h2" color={colors.white}>
            {usernameInitial}
          </AppText>
        </View>
        <View style={styles.userInfo}>
          <AppText variant="h3">{user?.username}</AppText>
          <AppText variant="caption" color={colors.gray500}>
            {t('profile.role', { role: user?.role ?? '' })}
          </AppText>
        </View>
      </AppCard>

      <View style={styles.footer}>
        <AppButton intent="outlined" label={t('profile.logout')} onPress={logout} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.extraLarge,
    paddingBottom: spacing.medium,
  },
  centeredText: { textAlign: 'center' },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medium,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.violet600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { gap: spacing.extraSmall },
  footer: { marginTop: spacing.large },
});
