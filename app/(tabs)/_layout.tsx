import { colors } from '@/constants/Colors'
import theme from '@/constants/Theme'
import useAuthStore from '@/stores/authStore'
import useScreenStore from '@/stores/screenStore'
import { user } from '@/types/user'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Tabs, useNavigation } from 'expo-router'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function HomeLayout() {
  const user: user = useAuthStore((state: any) => state.user)

  return (
    <>
      <StatusBar
        barStyle="light-content" // 상태바 아이콘을 밝게 표시 (아이콘 색상: 하얀색)
        backgroundColor="#1c1f2a" // 상태바 배경색
        // translucent={true}
      />
      <View style={styles.header}>
        <View style={styles.userCoinContainer}>
          <FontAwesome5 name="coins" size={24} color={colors.deepRed} />
          {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
        </View>
      </View>
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
          tabBarActiveTintColor: colors.deepRed,
          tabBarInactiveTintColor: colors.lightGray,
          tabBarStyle: {
            backgroundColor: colors.darkGray,
            borderTopWidth: 0,
            height: 72,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarItemStyle: {
            borderRadius: 10,
            margin: 10,
          },
        })}
      >
        <Tabs.Screen
          name="(index)"
          options={{
            title: '나의 미션',
          }}
        />
        <Tabs.Screen
          name="love"
          options={{
            title: '연인의 미션',
          }}
        />
        <Tabs.Screen
          name="coupon"
          options={{
            title: '쿠폰',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: '이력 관리',
          }}
        />
        <Tabs.Screen
          name="(setting)"
          options={{
            title: '설정',
          }}
        />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    padding: 16,
    alignItems: 'flex-end',
  },
  userCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 12,
  },
  userCoin: {
    minWidth: 36,
    textAlign: 'right',
    color: colors.deepRed,
    fontWeight: 'bold',
  },
})
