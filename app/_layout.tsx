import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar, StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import theme from '@/shared/constants/Theme'
import { setCustomText } from 'react-native-global-props'
import { getAuthData } from '@/shared/lib/async-storage/auth'
import { setNotificationListeners } from '@/shared/lib/pushNotification'
import {
  initMobileAds,
  setRewardAdvertisement,
} from '@/shared/lib/advertisement'
import { queryClient } from '@/shared/lib/react-query/queryClient'

function RootNavigator() {
  const router = useRouter()

  const [loaded, error] = useFonts({
    pretendard: require('@/shared/assets/fonts/Pretendard-Regular.ttf'),
    pretendardBold: require('@/shared/assets/fonts/Pretendard-Bold.ttf'),
  })

  useEffect(() => {
    initMobileAds()
    setNotificationListeners()
  }, [])

  const authProcess = async () => {
    if (!loaded) return

    const authData = await getAuthData()

    if (authData?.email) {
      // 인증된 사용자는 메인으로
      router.replace('/(tabs)/(index)')
    } else {
      // 미인증 사용자는 로그인으로
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
        barStyle='light-content'
        translucent={true}
        backgroundColor='transparent'
      />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: styles.container }}
      >
        <Stack.Screen name='auth' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='+not-found' />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, // 상태바 높이만큼 패딩 추가 (모든 화면에 적용)
    backgroundColor: theme.colors.background,
  },
})
