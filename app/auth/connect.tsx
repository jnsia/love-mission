import { useState, useEffect } from 'react'
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '@/shared/constants/Colors'
import { fonts } from '@/shared/constants/Fonts'
import theme from '@/shared/constants/Theme'
import { User } from '@/features/user/types/user.type'
import { sendPushNotification } from '@/shared/lib/pushNotification'
import RegistButton from '@/shared/components/RegistButton'
import { router } from 'expo-router'
import { logout } from '@/features/user/api/auth.api'
import {
  fetchCurrentUser,
  fetchUserBySecret,
  updateSecret,
  updateUserLoveId,
} from '@/features/user/api/user.api'
import { registerMission } from '@/features/mission/api/mission.api'
import { issueCoupon } from '@/features/coupon/api/coupon.api'

export default function ConnectScreen() {
  const [user, setUser] = useState<User>()
  const [secret, setSecret] = useState('')
  const [generatedSecret, setgeneratedSecret] = useState('')
  const [animation] = useState(new Animated.Value(1))

  const handleFocus = () => {
    Animated.spring(animation, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const handleBlur = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const generateSecret = async () => {
    if (!user) return
    const secret = Math.floor(100000 + Math.random() * 900000).toString()
    await updateSecret(user.id, secret)
    setgeneratedSecret(secret)
  }

  const removeSecret = async () => {
    if (!user) return
    await updateSecret(user.id, null)
    setgeneratedSecret('')
  }

  const connectLove = async (love: User) => {
    if (!user) return

    try {
      const partialMissionRegisterRequest = {
        title: '연인 꼭 안아주기!',
        description: '',
        type: 'special',
        successCoin: 100,
        failCoin: 0,
      }

      const partialCouponIssueRequest = {
        name: '뽀뽀 해줘!',
        description: '',
        price: 100,
      }

      await Promise.all([
        updateUserLoveId(user.id, love.id),
        updateUserLoveId(love.id, user.id),
        registerMission({
          ...partialMissionRegisterRequest,
          userId: user.id,
        }),
        registerMission({
          ...partialMissionRegisterRequest,
          userId: love.id,
        }),
        issueCoupon({
          ...partialCouponIssueRequest,
          userId: user.id,
        }),
        issueCoupon({
          ...partialCouponIssueRequest,
          userId: love.id,
        }),
      ])

      await sendPushNotification(
        love.fcmToken,
        '연인과 연결되었습니다.',
        '러브미션을 즐겨주세요!',
        'index',
      )
    } catch (error) {
      console.error(error)
    }
  }

  const submitSecret = async () => {
    if (secret.length !== 6) return

    const user = await fetchUserBySecret(secret)

    if (user == null) {
      Alert.alert('잘못된 암호입니다.')
    } else {
      Alert.alert(
        `${user.email} 님과 연결되었습니다.`,
        '연결을 진행하시겠습니까?',
        [
          {
            text: '아니요.',
          },
          {
            text: '네!',
            onPress: () => {
              connectLove(user)
            },
          },
        ],
        { cancelable: false },
      )
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/auth/signIn')
    } catch {
      Alert.alert('로그아웃에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCompleteSecret = () => {
    Animated.timing(animation, {
      toValue: 1.2,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animation, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start()
    })
  }

  const getCurrentUser = async () => {
    const currentUser = await fetchCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      Alert.alert('로그인 정보가 없습니다. 다시 로그인해주세요.')
      router.replace('/auth/signIn')
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (secret.length === 6) {
      handleCompleteSecret()
    }
  }, [secret])

  return (
    <View style={styles.container}>
      {generatedSecret == '' ? (
        <View>
          <Text style={styles.title}>암호를 발급하거나 입력해주세요!</Text>
          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ scale: animation }] },
            ]}
          >
            {/* <FontAwesome name="lock" size={24} color="#FF6347" style={styles.icon} /> */}
            <View style={styles.secretContainer}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <View
                    key={i}
                    style={
                      secret[i]
                        ? { ...styles.secretBox, ...styles.secretFilled }
                        : styles.secretBox
                    }
                  >
                    <Text style={styles.secretText}>{secret[i] || ''}</Text>
                  </View>
                ))}
            </View>
            <TextInput
              style={styles.hiddenInput}
              value={secret}
              onChangeText={setSecret}
              keyboardType='numeric'
              maxLength={6}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
          </Animated.View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={generateSecret}>
              <Text style={styles.buttonText}>암호 생성</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={submitSecret}>
              <Text style={styles.buttonText}>암호 제출</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>암호를 생성하였습니다!</Text>
          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ scale: animation }] },
            ]}
          >
            <View style={styles.secretContainer}>
              {generatedSecret.split('').map((value, index) => (
                <View
                  key={value + index * index}
                  style={{ ...styles.secretBox, ...styles.secretFilled }}
                >
                  <Text style={styles.secretText}>{value}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={removeSecret}>
              <Text style={styles.buttonText}>생성 취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <RegistButton text='다시 로그인하기' onPressEvent={handleLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347',
    fontFamily: fonts.defaultBold,
    textAlign: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  hiddenInput: {
    position: 'absolute',
    width: 280,
    height: 52,
    opacity: 0,
    letterSpacing: 32,
    fontSize: 24,
  },
  secretContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  secretBox: {
    width: 40,
    height: 52,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  secretFilled: {
    borderColor: '#FF6347',
  },
  secretText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#FF6347',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fonts.size.body,
    color: '#FFF',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
})
