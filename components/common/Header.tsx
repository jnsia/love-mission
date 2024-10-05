import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import theme from '@/constants/Theme'
import { colors } from '@/constants/Colors'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'

export default function Header() {
  const user: user = useAuthStore((state: any) => state.user)

  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getRecentUserInfo(user.id)
      }
    }, [user]),
  )

  return (
    <View style={styles.header}>
      <View style={styles.userCoinContainer}>
        <FontAwesome5 name="coins" size={24} color={colors.accent} />
        {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    padding: 16,
    alignItems: 'flex-end',
  },
  userCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 12,
  },
  userCoin: {
    minWidth: 36,
    textAlign: 'right',
    color: colors.accent,
    fontWeight: 'bold',
  },
})
