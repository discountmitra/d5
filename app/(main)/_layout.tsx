import React from 'react';
import { Stack } from 'expo-router';
import BottomBar from '../../components/common/BottomBar';

export default function MainLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#ffffff', paddingBottom: 70 },
        }}
      />
      <BottomBar />
    </>
  );
}


