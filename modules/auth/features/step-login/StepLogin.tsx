import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton, AppInput, AppText } from '@shared/ui';
import { useAuthSessionStore } from '../../shared/store';
import { validateCredentials } from '../../shared/utils/validators';
import { colors, spacing } from '@shared/theme';

interface StepLoginProps {
  onRegisterClick: () => void;
}

export function StepLogin({ onRegisterClick }: StepLoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading } = useAuthSessionStore();

  const handleLogin = async () => {
    const validationError = validateCredentials(username, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    try {
      await login(username, password);
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="h1">Login</AppText>
      <AppText variant="body" style={styles.subtitle}>
        Demo credentials: admin / 1234
      </AppText>

      <AppInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
      />

      <AppInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {error && (
        <AppText variant="caption" color={colors.error600}>
          {error}
        </AppText>
      )}

      <AppButton label="Login" onPress={handleLogin} disabled={isLoading} />

      <AppButton label="Don't have an account? Register" intent="secondary" onPress={onRegisterClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.medium,
  },
  subtitle: {
    marginTop: spacing.medium,
    marginBottom: spacing.large,
  },
});
