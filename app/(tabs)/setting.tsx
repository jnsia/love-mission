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
    sendPushNotification(user.fcmToken, 'test', 'fcm 테스트를 위한 sendPushNotification')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user.id}</Text>
      <TouchableOpacity style={styles.submit} onPress={remove}>
        <Text style={styles.text}>로그아웃...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submit} onPress={fcmTest}>
        <Text style={styles.text}>fcmTest...</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
