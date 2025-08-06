import Header from '@/shared/components/Header'
import { colors } from '@/shared/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StatusBar, StyleSheet } from 'react-native'

export default function HomeLayout() {
  return (
    <>
      <StatusBar
        barStyle='light-content' // 상태바 아이콘을 밝게 표시 (아이콘 색상: 하얀색)
        backgroundColor='#1c1f2a' // 상태바 배경색
        // translucent={true}
      />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = ''

            if (route.name === '(index)') {
              iconName = 'clipboard'
            } else if (route.name === 'love') {
              iconName = 'heart'
            } else if (route.name === 'coupon') {
              iconName = 'ticket'
            } else if (route.name === 'history') {
              iconName = 'history'
            } else if (route.name === '(setting)') {
              iconName = 'cog'
            }
            // @ts-expect-error
            return <FontAwesome name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.lightGray,
          tabBarStyle: {
            backgroundColor: colors.darkGray,
            borderTopWidth: 0,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarItemStyle: {
            borderRadius: 10,
            margin: 10,
          },
        })}
      >
        <Tabs.Screen
          name='(index)'
          options={{
            title: '나의 미션',
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Tabs.Screen
          name='love'
          options={{
            title: '연인의 미션',
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Tabs.Screen
          name='coupon'
          options={{
            title: '쿠폰',
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Tabs.Screen
          name='history'
          options={{
            title: '기록',
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Tabs.Screen
          name='(setting)'
          options={{
            title: '설정',
            headerShown: true,
            header: () => <Header />,
          }}
        />
      </Tabs>
    </>
  )
}
