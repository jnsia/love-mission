import { Stack } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen
        name="history"
      />
    </Stack>
  )
}
