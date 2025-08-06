import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import theme from '@/shared/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { user } from '@/shared/types/user'

export default function Authlayout() {
  const user: user = useAuthStore((state: any) => state.user)

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: styles.container }}>
      <Stack.Screen name='signIn' />
      <Stack.Screen name='signUp' />
      <Stack.Screen name='connect' />
    </Stack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
})
