import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import theme from '@/constants/Theme'
import { colors } from '@/constants/Colors'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { fonts } from '@/constants/Fonts'
import { rewarded } from '@/lib/advertisement'

export default function Header() {
  const user: user = useAuthStore((state: any) => state.user)
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)

  const clickCoinContainer = () => {
    rewarded.show()
  }

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getRecentUserInfo(user.id)
      }
    }, []),
  )

  return (
    <View style={styles.header}>
      {rewarded.loaded ? (
        <TouchableOpacity style={styles.userCoinContainer} onPress={clickCoinContainer}>
          <View>
            <View style={{ position: 'relative', right: 5, top: 5 }}>
              <FontAwesome5 name="coins" size={20} color={colors.accent} />
            </View>
            <View style={{ position: 'relative', left: 15, bottom: 5 }}>
              <FontAwesome5 name="plus" size={12} color={colors.accent} />
            </View>
          </View>
          {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
        </TouchableOpacity>
      ) : (
        <View style={styles.userCoinContainer}>
          <FontAwesome5 name="coins" size={20} color={colors.accent} />
          {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    padding: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 60,
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
    fontSize: fonts.size.body,
    fontFamily: fonts.defaultBold,
  },
})
