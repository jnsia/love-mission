import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  BackHandler,
  Modal,
  PermissionsAndroid,
  Alert,
  Animated,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useFocusEffect } from '@react-navigation/native'
import { colors } from '@/constants/Colors'
import theme from '@/constants/Theme'
import { FontAwesome } from '@expo/vector-icons'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { router } from 'expo-router'
import { fonts } from '@/constants/Fonts'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [eamilInputAnimation] = useState(new Animated.Value(1))
  const [passwordInputAnimation] = useState(new Animated.Value(1))

  const user: user = useAuthStore((state: any) => state.user)
  const signIn = useAuthStore((state: any) => state.signIn)

  const handleEmailInputFocus = () => {
    Animated.spring(eamilInputAnimation, {
      toValue: 1.05,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const handlePasswordInputFocus = () => {
    Animated.spring(passwordInputAnimation, {
      toValue: 1.05,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const handleEmailInputBlur = () => {
    Animated.spring(eamilInputAnimation, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const handlePasswordInputBlur = () => {
    Animated.spring(passwordInputAnimation, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const clickSignInButton = async () => {
    if (email === '') {
      return Alert.alert('이메일을 입력해 주세요.')
    }

    if (password === '') {
      return Alert.alert('비밀번호를 입력해 주세요.')
    }

    const userInfo: user = await signIn(email)

    if (userInfo == null) {
      return Alert.alert('가입된 회원이 아니거나 비밀번호가 틀립니다.')
    }

    setEmail('')
    setPassword('')

    if (userInfo.loveId == null) {
      router.replace('/auth/connect')
    } else {
      router.replace('/(tabs)')
    }
  }

  const clickSignUpButton = async () => {
    router.replace('/auth/signUp')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Love Mission</Text>
      <Animated.View
        style={[styles.inputContainer, { transform: [{ scale: eamilInputAnimation }] }]}
      >
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          onFocus={handleEmailInputFocus}
          onBlur={handleEmailInputBlur}
        />
      </Animated.View>
      <Animated.View
        style={[styles.inputContainer, { transform: [{ scale: passwordInputAnimation }] }]}
      >
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          onFocus={handlePasswordInputFocus}
          onBlur={handlePasswordInputBlur}
        />
      </Animated.View>
      <TouchableOpacity style={styles.button} onPress={clickSignInButton}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <View style={{ gap: 8, marginTop: 16 }}>
        <View style={styles.optionBox}>
          {/* <Text
            style={styles.text}
            onPress={() => {
              console.log('이메일/비밀번호 찾기')
            }}
          >
            이메일/비밀번호 찾기
          </Text> */}
          <Text style={styles.text} onPress={clickSignUpButton}>
            회원가입
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.deepRed,
    fontFamily: fonts.defaultBold,
  },
  optionBox: {
    width: '100%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: colors.deepRed,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 16,
    gap: 24,
  },
  input: {
    width: '100%',
    height: 50,
    fontFamily: fonts.default,
  },
  text: {
    color: colors.lightGray,
    fontFamily: fonts.default,
  },
  warningText: {
    color: colors.deepRed,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: colors.deepRed,
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
