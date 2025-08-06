import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import theme from '@/shared/constants/Theme'
import { colors } from '@/shared/constants/Colors'
import { user } from '@/shared/types/user'
import useAuthStore from '@/stores/authStore'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { fonts } from '@/shared/constants/Fonts'
import { rewarded } from '@/shared/lib/advertisement'

export default function Header() {
  const user: user = useAuthStore((state: any) => state.user)
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)

  const showAds = () => {
    try {
      rewarded.show()
    } catch (error) {
      Alert.alert('리워드 광고', '준비된 광고가 없습니다.')
    }
  }

  const clickCoinContainer = () => {
    Alert.alert(
      '리워드 광고',
      '광고를 시청하고 100Coin을 획득하시겠습니까?',
      [
        {
          text: '아니요',
        },
        {
          text: '네!',
          onPress: showAds,
        },
      ],
      { cancelable: false },
    )
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
      <TouchableOpacity style={styles.userCoinContainer} onPress={clickCoinContainer}>
        <View>
          <View style={{ position: 'relative', right: 10, top: 5 }}>
            <FontAwesome5 name='coins' size={20} color={colors.accent} />
          </View>
          <View style={{ position: 'relative', left: 10, bottom: 5 }}>
            <FontAwesome5 name='plus' size={12} color={colors.accent} />
          </View>
        </View>
        {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
      </TouchableOpacity>
      {/* <View style={styles.userCoinContainer}>
        <FontAwesome5 name="coins" size={20} color={colors.accent} />
        {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
      </View> */}
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
    gap: 8,
  },
  userCoin: {
    minWidth: 36,
    textAlign: 'right',
    color: colors.accent,
    fontSize: fonts.size.body,
    fontFamily: fonts.defaultBold,
  },
})
