import RegistButton from '@/components/common/RegistButton'
import OpinionSendModal from '@/components/setting/OpinionSendModal'
import theme from '@/constants/Theme'
import { sendPushNotification } from '@/lib/sendPushNotification'
import useAuthStore from '@/stores/authStore'
import { user } from '@/types/user'
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

  const remove = async () => {
    await logout(user.id)
  }

  const fcmTest = () => {
    sendPushNotification(user.fcmToken, 'test', 'fcm 테스트를 위한 sendPushNotification', 'index')
  }

  return (
    <View style={styles.container}>
      <RegistButton text="의견 보내기" onPressEvent={clickSendOpinionButton} />
      <RegistButton text="로그아웃" onPressEvent={remove} />
      {[3, 4].includes(user?.id) && (
        <View>
          <Text>{user.id || "null"}</Text>
          <RegistButton text="FCM 테스트 버튼" onPressEvent={fcmTest} />
        </View>
      )}
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
