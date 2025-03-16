import { Stack } from 'expo-router';
import React from 'react';
import '../../ReactotronConfig';

if (__DEV__) {
  console.tron.log('✅ Reactotron đã được cấu hình trong Expo!');
}

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'black' },
      }}
    />
  );
}
