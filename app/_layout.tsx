import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-reanimated'
import useAuthStore from '@/stores/authStore'
import { StatusBar, StyleSheet } from 'react-native'
import { user } from '@/types/user'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import theme from '@/constants/Theme'
import { setCustomText } from 'react-native-global-props'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setNotificationListeners } from '@/lib/pushNotification'
import BannerAdvertisement from '@/components/advertisement/BannerAdvertisement'
import { initMobileAds, setRewardAdvertisement } from '@/lib/advertisement'

export default function RootLayout() {
  const user: user = useAuthStore((state: any) => state.user)
  const getLoveFcmToken = useAuthStore((state: any) => state.getLoveFcmToken)
  const getUserInfoByEmail = useAuthStore((state: any) => state.getUserInfoByEmail)

  const router = useRouter()

  useEffect(() => {
    initMobileAds()
    setNotificationListeners()
  }, [])

  useEffect(() => {
    if (user) setRewardAdvertisement(user, getUserInfoByEmail)
  }, [user])

  const [loaded, error] = useFonts({
    pretendard: require('@/assets/fonts/Pretendard-Regular.ttf'),
    pretendardBold: require('@/assets/fonts/Pretendard-Bold.ttf'),
  })

  const authProcess = async () => {
    if (!loaded) return

    const isLoggedIn = await AsyncStorage.getItem('isLoggedInLoveMission')

    if (isLoggedIn) {
      const user: user = await getUserInfoByEmail(isLoggedIn)

      if (user.loveId == null) {
        router.replace('/auth/connect')
      } else {
        await getLoveFcmToken(user.loveId)
        router.replace('/(tabs)/(index)')
      }
    } else {
      router.replace('/auth')
    }

    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }

  useEffect(() => {
    authProcess()
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
      <BannerAdvertisement />
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
