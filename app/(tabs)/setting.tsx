import theme from '@/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function SettingScreen() {
  const user = useAuthStore((state: any) => state.user)
  const logout = useAuthStore((state: any) => state.logout)

  const remove = async () => {
    await logout(user.id)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.submit} onPress={remove}>
        <Text>로그아웃...</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background
  },
  submit: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
  },
})
