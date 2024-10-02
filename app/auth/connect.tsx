import { useState, useEffect } from 'react'
import { Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { colors } from '@/constants/Colors'
import { fonts } from '@/constants/Fonts'
import theme from '@/constants/Theme'
import RegistButton from '@/components/common/RegistButton'
import useAuthStore from '@/stores/authStore'
import { supabase } from '@/utils/supabase'
import { user } from '@/types/user'
import { sendPushNotification } from '@/lib/sendPushNotification'

export default function ConnectScreen() {
  const [secret, setSecret] = useState('')
  const [generatedSecret, setgeneratedSecret] = useState('')
  const [animation] = useState(new Animated.Value(1))

  const user: user = useAuthStore((state: any) => state.user)
  const logout = useAuthStore((state: any) => state.logout)

  useEffect(() => {
    if (secret.length === 6) {
      handleCompleteSecret()
    }
  }, [secret])

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

  const clickGenerateButton = async () => {
    const secret = Math.floor(100000 + Math.random() * 900000).toString()

    try {
      await supabase.from('users').update({ secret: secret }).eq('id', user.id)
    } catch (err) {
      console.error(err)
      return
    }

    setgeneratedSecret(secret)
  }

  const clickCancleButton = async () => {
    try {
      await supabase.from('users').update({ secret: null }).eq('id', user.id)
    } catch (err) {
      console.error(err)
      return
    }

    setgeneratedSecret('')
  }

  const connectLove = async (love: user) => {
    try {
      await supabase.from('users').update({ loveId: love.id }).eq('id', user.id)
      await supabase.from('users').update({ loveId: user.id }).eq('id', love.id)

      await supabase.from('missions').insert({
        title: '연인 꼭 안아주기!',
        description: '',
        type: 'special',
        successCoin: 100,
        failCoin: 0,
        userId: user.loveId,
      })

      await supabase.from('missions').insert({
        title: '연인 꼭 안아주기!',
        description: '',
        type: 'special',
        successCoin: 100,
        failCoin: 0,
        userId: love.id,
      })

      await supabase
      .from('loveCoupons')
      .insert({ name: "뽀뽀 해줘!", description: "", price: 100, userId: user.id })

      await supabase
      .from('loveCoupons')
      .insert({ name: "뽀뽀 해줘!", description: "", price: 100, userId: love.id })

      await sendPushNotification(
        love.fcmToken,
        '연인과 연결되었습니다.',
        '러브미!션을 즐겨주세요!',
        'index',
      )

      await supabase.from('users').update({ secret: null }).eq('id', love.id)
    } catch (error) {
      console.error(error)
    }
  }

  const clickConnectButton = async () => {
    if (secret.length !== 6) return

    const { data, error } = await supabase.from('users').select().eq('secret', secret)

    if (error) {
      console.error(error)
      return
    }

    const user = data[0]

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

  const clickLogoutButton = async () => {
    await logout(user.id)
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

  return (
    <View style={styles.container}>
      {generatedSecret == '' ? (
        <View>
          <Text style={styles.title}>암호를 발급하거나 입력해주세요!</Text>
          <Animated.View style={[styles.inputContainer, { transform: [{ scale: animation }] }]}>
            {/* <FontAwesome name="lock" size={24} color="#FF6347" style={styles.icon} /> */}
            <View style={styles.secretContainer}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <View
                    key={i}
                    style={
                      secret[i] ? { ...styles.secretBox, ...styles.secretFilled } : styles.secretBox
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
              keyboardType="numeric"
              maxLength={6}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
          </Animated.View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={clickGenerateButton}>
              <Text style={styles.buttonText}>암호 생성</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={clickConnectButton}>
              <Text style={styles.buttonText}>암호 제출</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>암호를 생성하였습니다!</Text>
          <Animated.View style={[styles.inputContainer, { transform: [{ scale: animation }] }]}>
            {/* <FontAwesome name="lock" size={24} color="#FF6347" style={styles.icon} /> */}
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
            <TouchableOpacity style={styles.button} onPress={clickCancleButton}>
              <Text style={styles.buttonText}>생성 취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <RegistButton text="다시 로그인하기" onPressEvent={clickLogoutButton} />
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
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
})
