import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { colors } from '@/shared/constants/Colors'
import { FontAwesome5 } from '@expo/vector-icons'
import { rewarded } from '@/shared/lib/advertisement'
import Typography from './Typography'
import { useCurrentUser, useRefreshUser } from '@/shared/hooks/useAuth'
import { useFocusEffect } from 'expo-router'

export default function Header() {
  const { data: user, refetch } = useCurrentUser()
  const refreshUser = useRefreshUser()

  // 화면 포커스시 사용자 정보 새로고침
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        refreshUser.mutate(user.id)
      } else {
        refetch()
      }
    }, [user])
  )

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

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.userCoinContainer}
        onPress={clickCoinContainer}
      >
        <View>
          <View style={{ position: 'relative', right: 10, top: 5 }}>
            <FontAwesome5 name='coins' size={20} color={colors.accent} />
          </View>
          <View style={{ position: 'relative', left: 10, bottom: 5 }}>
            <FontAwesome5 name='plus' size={12} color={colors.accent} />
          </View>
        </View>
        {user && <Typography variant="body" color="accent" style={styles.userCoin}>{user.coin} Coin</Typography>}
      </TouchableOpacity>
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
  },
})
