import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import theme from '@/constants/Theme'

export default function Authlayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: styles.container }}>
      <Stack.Screen name="signIn" />
    </Stack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
})
