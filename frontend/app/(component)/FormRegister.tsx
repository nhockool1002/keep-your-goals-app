import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { lightTheme } from '../../constants/lightTheme';
import axios from 'axios';
import Constants from 'expo-constants';
import { saveToken } from '../../utils/storageUtil';
import { useRouter } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3000';

interface FormRegisterProps {
  onSwitch: () => void;
  theme: typeof lightTheme;
}

const FormRegister: React.FC<FormRegisterProps> = ({ onSwitch, theme }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      setError('');
    }, [i18n.language]);

  const isFormValid = username.length >= 6 &&
    email.includes('@') &&
    password.length >= 6 &&
    !isSubmitting;

  const validateAndSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    if (username.length < 6 || username.length > 25) {
      setError(`${t('username')} ${t('validation.min_6_max_25_error')}`);
      setIsSubmitting(false);
      return;
    }

    if (email.length < 6 || email.length > 255 || !email.includes('@') || !email.includes('.')) {
      setError(`${t('email')} ${t('validation.is_invalid')}`);
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6 || password.length > 25) {
      setError(`${t('password')} ${t('validation.min_6_max_25_error')}`);
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(`${t('confirm_password')} ${t('validation.is_not_correct')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/v1/auth/register`, {
        email,
        password,
        username,
      });

      await saveToken(response.data.accessToken);
      router.replace('/Home'); // Chuyển đến trang Home sau khi đăng ký
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Đăng ký thất bại');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`${t('error.server_internal_error')}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Tên người dùng */}
      <Input
        placeholder={t('username')}
        leftIcon={{ type: 'ionicon', name: 'person-outline', color: theme.primaryText }}
        value={username}
        onChangeText={setUsername}
        maxLength={25}
        placeholderTextColor="gray"
        inputStyle={[{ color: theme.primaryText }, styles.inputLight]}
        inputContainerStyle={[styles.inputContainer, {borderBottomColor: theme.colorBottomInactive}]}
      />

      {/* Input Email */}
      <Input
        placeholder={t('email')}
        leftIcon={{ type: 'ionicon', name: 'mail-outline', color: theme.primaryText }}
        value={email}
        onChangeText={setEmail}
        maxLength={255}
        keyboardType="email-address"
        placeholderTextColor="gray"
        inputStyle={[{ color: theme.primaryText }, styles.inputLight]}
        inputContainerStyle={[styles.inputContainer, {borderBottomColor: theme.colorBottomInactive}]}
      />

      {/* Input Mật khẩu */}
      <Input
        placeholder={t('password')}
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: theme.primaryText }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={25}
        placeholderTextColor="gray"
        inputStyle={[{ color: theme.primaryText }, styles.inputLight]}
        inputContainerStyle={[styles.inputContainer, {borderBottomColor: theme.colorBottomInactive}]}
      />

      {/* Input Xác nhận Mật khẩu */}
      <Input
        placeholder={t('confirm_password')}
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: theme.primaryText }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        maxLength={25}
        placeholderTextColor="gray"
        inputStyle={[{ color: theme.primaryText }, styles.inputLight]}
        inputContainerStyle={[styles.inputContainer, {borderBottomColor: theme.colorBottomInactive}]}
      />

      {/* Hiển thị lỗi nếu có */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Nút Đăng ký */}
      <Button
        title={isSubmitting ? t('registering') : t('register')}
        buttonStyle={[styles.button, {backgroundColor: theme.colorBottomActive}]}
        onPress={validateAndSubmit}
        titleStyle={styles.textButton}
        disabled={!isFormValid} // Tắt nút khi form chưa hợp lệ
      />
    </View>
  );
};

export default FormRegister;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 10,
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: "center",
    width: "100%",
  },
  inputLight: {
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 1.5,
  },
  inputContainer: {
    borderBottomWidth: 1
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
