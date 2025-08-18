import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import theme from '@/shared/constants/Theme'

export default function Authlayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: styles.container }}
    >
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
