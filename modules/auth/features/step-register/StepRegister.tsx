import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton, AppInput, AppText } from '@shared/ui';
import { spacing } from '@shared/theme';

interface StepRegisterProps {
  onBackClick: () => void;
}

export function StepRegister({ onBackClick }: StepRegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <AppText variant="h1">Create Account</AppText>

      <AppInput placeholder="Email" value={email} onChangeText={setEmail} />

      <AppInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AppInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <AppButton label="Register" onPress={() => {}} />

      <AppButton label="Back to Login" intent="secondary" onPress={onBackClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.medium,
  },
});
