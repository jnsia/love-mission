import RegistButton from '@/components/common/RegistButton'
import theme from '@/constants/Theme'
import { sendPushNotification } from '@/lib/sendPushNotification'
import useAuthStore from '@/stores/authStore'
import { user } from '@/types/user'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function SettingScreen() {
  const user: user = useAuthStore((state: any) => state.user)
  const logout = useAuthStore((state: any) => state.logout)

  const remove = async () => {
    await logout(user.id)
  }

  const fcmTest = () => {
    sendPushNotification(user.fcmToken, 'test', 'fcm 테스트를 위한 sendPushNotification', 'index')
  }

  return (
    <View style={styles.container}>
      <RegistButton text="로그아웃" onPressEvent={remove} />
      {[3, 4].includes(user.id) && (
        <View>
          <Text>{user.id || "null"}</Text>
          <RegistButton text="FCM 테스트 버튼" onPressEvent={fcmTest} />
        </View>
      )}
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
