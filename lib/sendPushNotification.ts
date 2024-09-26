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

export async function settingNotificationListeners() {
  const notificationResponseReceivedListener =
    Notifications.addNotificationResponseReceivedListener(async () => {
      router.replace('/(tabs)')
    })

  const notificationReceivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
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
    },
  )

  return () => {
    Notifications.removeNotificationSubscription(notificationReceivedListener)
    Notifications.removeNotificationSubscription(notificationResponseReceivedListener)
  }
}

export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync()

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
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

  return token
}
