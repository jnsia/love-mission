import { router } from 'expo-router'
import * as Notifications from 'expo-notifications'
import { Alert, Platform } from 'react-native'

export async function sendPushNotification(
  to: string,
  title: string,
  body: string,
  screen: string,
) {
  const message = {
    to,
    sound: 'default',
    title,
    body,
    data: { screen: screen },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}

export async function setNotificationListeners() {
  const notificationResponseReceivedListener =
    Notifications.addNotificationResponseReceivedListener(async () => {
      router.replace('/(tabs)')
    })

  const notificationReceivedListener =
    Notifications.addNotificationReceivedListener((notification) => {
      const content = notification.request.content
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
    })

  return () => {
    Notifications.removeNotificationSubscription(notificationReceivedListener)
    Notifications.removeNotificationSubscription(
      notificationResponseReceivedListener,
    )
  }
}

export async function registerForPushNotificationsAsync() {
  // 1. 현재 권한 상태 확인
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  // 2. 권한이 없는 경우에만 요청
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  // 3. 권한이 없으면 종료
  if (finalStatus !== 'granted') {
    alert('푸시 알림을 허용해주세요!')
    return null
  }

  // 4. Android 채널 설정
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  // 5. 알림 핸들러 설정
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })

  // 6. 토큰 발급 시도
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.projectId, // 프로젝트 ID 필수
    })
    return token.data
  } catch (error) {
    console.error('푸시 토큰 발급 오류:', error)
    return null
  }
}
