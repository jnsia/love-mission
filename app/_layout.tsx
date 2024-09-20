import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-reanimated'
import useAuthStore from '@/stores/authStore'
import { Alert, Platform, StatusBar, StyleSheet } from 'react-native'
import * as Notifications from 'expo-notifications'
import { supabase } from '@/utils/supabase'
import { user } from '@/types/user'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import theme from '@/constants/Theme'
import { setCustomText } from 'react-native-global-props'

export default function RootLayout() {
  const user: user = useAuthStore((state: any) => state.user)
  const isLoggedIn: boolean = useAuthStore((state: any) => state.isLoggedIn)
  const setIsLoggedIn = useAuthStore((state: any) => state.setIsLoggedIn)
  const getPIN = useAuthStore((state: any) => state.getPIN)
  const getLoveFcmToken = useAuthStore((state: any) => state.getLoveFcmToken)
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)

  const router = useRouter()

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync()

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (status !== 'granted') {
      alert('푸시 알림을 허용해주세요!')
      return
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data

    // Supabase에 푸시 토큰 저장
    const { error } = await supabase.from('users').update({ fcmToken: token }).eq('id', user.id)

    getRecentUserInfo(user.id)

    if (error) console.error('토큰 저장 오류:', error)
  }

  useEffect(() => {
    getPIN()

    const notificationResponseReceivedListener =
      Notifications.addNotificationResponseReceivedListener(async () => {
        router.replace('/(tabs)')
      })

    const notificationReceivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const content = notification.request.content
        // console.log(content)
        Alert.alert(
          content.title || '정체불명의 인앱 메세지',
          `해당 페이지로 이동하시겠습니까?`,
          [
            {
              text: '아니요',
            },
            {
              text: '네!',
              onPress: () => {
                if (content.data && content.data.screen) {
                  router.replace(content.data.screen)
                } else {
                  router.replace('/(tabs)')
                }
              },
            },
          ],
          { cancelable: false },
        )
      },
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationReceivedListener)
      Notifications.removeNotificationSubscription(notificationResponseReceivedListener)
    }
  }, [])

  const [loaded, error] = useFonts({
    pretendard: require('@/assets/fonts/Pretendard-Regular.ttf'),
    pretendardBold: require('@/assets/fonts/Pretendard-Bold.ttf'),
  })

  useEffect(() => {
    if (user != null) {
      getLoveFcmToken(user.loveId)
    }
  }, [user])

  useEffect(() => {
    if (!loaded) return

    if (isLoggedIn) {
      registerForPushNotificationsAsync()
      router.replace('/(tabs)')
    } else {
      router.replace('/auth')
    }
  }, [isLoggedIn, loaded])

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  const customTextProps = {
    style: {
      fontFamily: 'pretendard',
    },
  }

  setCustomText(customTextProps)

  return (
    <>
      <StatusBar
        barStyle="light-content" // 상태바 아이콘을 밝게 표시
        translucent={true} // 상태바를 투명하게 설정
        backgroundColor="transparent" // 상태바의 배경을 투명하게 설정
      />
      <Stack screenOptions={{ headerShown: false, contentStyle: styles.container }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, // 상태바 높이만큼 패딩 추가 (모든 화면에 적용)
    backgroundColor: theme.colors.background,
  },
})
