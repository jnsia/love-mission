import RegistButton from '@/features/common/RegistButton'
import OpinionSendModal from '@/features/setting/OpinionSendModal'
import theme from '@/shared/constants/Theme'
import { sendPushNotification } from '@/shared/lib/pushNotification'
import useAuthStore from '@/stores/authStore'
import { user } from '@/shared/types/user'
import { router } from 'expo-router'
import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function SettingScreen() {
  const [modalVisible, setModalVisible] = useState(false)

  const user: user = useAuthStore((state: any) => state.user)
  const logout = useAuthStore((state: any) => state.logout)

  const clickSendOpinionButton = () => {
    setModalVisible(true)
  }

  const closeSendOpinionModal = () => {
    setModalVisible(false)
  }

  const clickScheduleButton = () => {
    router.push('/(setting)/schedule')
  }

  const clickLogoutButton = async () => {
    await logout(user.id)
  }

  const fcmTest = () => {
    sendPushNotification(user.fcmToken, 'test', 'fcm 테스트를 위한 sendPushNotification', 'index')
  }

  return (
    <View style={styles.container}>
      <RegistButton text='일일 미션 자동 등록' onPressEvent={clickScheduleButton} />
      <RegistButton text='의견 보내기' onPressEvent={clickSendOpinionButton} />
      <RegistButton text='로그아웃' onPressEvent={clickLogoutButton} />
      {[3, 4].includes(user?.id) && <RegistButton text='FCM 테스트 버튼' onPressEvent={fcmTest} />}
      <OpinionSendModal isVisible={modalVisible} closeModal={closeSendOpinionModal} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  submit: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderColor: theme.colors.text,
    borderWidth: 1,
    marginBottom: 16,
  },
  text: {
    color: theme.colors.text,
  },
})
