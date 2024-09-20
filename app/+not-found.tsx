import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'

export default function notFound() {
  useEffect(() => {
    router.replace('/(tabs)')
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 18,
        }}
      >
        Redirecting...
      </Text>
    </View>
  )
}
