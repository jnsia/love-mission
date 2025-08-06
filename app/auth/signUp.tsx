import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '@/shared/constants/Fonts'
import { colors } from '@/shared/constants/Colors'
import theme from '@/shared/constants/Theme'
import { router } from 'expo-router'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/shared/utils/supabase'

const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/

export default function SignUpScreen() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifiedPassword, setVerifiedPassword] = useState('')

  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [isValidVerifiedPassword, setIsValidVerifiedPassword] = useState(true)

  const onChangeEmail = (text: string) => {
    setEmail(text)

    if (text == '' || !regex.test(text)) {
      setIsValidEmail(false)
    } else {
      setIsValidEmail(true)
    }
  }

  const onChangePassword = (text: string) => {
    setPassword(text)

    if (text.length < 8) {
      setIsValidPassword(false)
    } else {
      setIsValidPassword(true)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const onChangeVerifiedPassword = (text: string) => {
    setVerifiedPassword(text)

    if (text == '' || password == text) {
      setIsValidVerifiedPassword(true)
    } else {
      setIsValidVerifiedPassword(false)
    }
  }

  const clickSignUpButton = async () => {
    if (email == '' || !isValidEmail) {
      Alert.alert('이메일 형식에 맞게 입력해주세요.')
      return
    } else if (password == '' || !isValidPassword) {
      Alert.alert('비밀번호는 8자 이상 입력해주세요.')
      return
    } else if (!isValidVerifiedPassword) {
      Alert.alert('비밀번호가 서로 일치하지 않습니다.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      console.error(error)
      Alert.alert('이미 가입된 이메일입니다.')
      return
    }

    await supabase.from('users').insert({ email: email })

    nextStep()
  }

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.inputBox}>
              <TextInput
                keyboardType='email-address'
                style={styles.input}
                placeholder='이메일'
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={(text) => onChangeEmail(text)}
                returnKeyType='next'
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder='8자리 이상 입력해주세요.'
                placeholderTextColor={'gray'}
                value={password}
                onChangeText={(text) => onChangePassword(text)}
                returnKeyType='next'
                secureTextEntry
              />
            </View>
            {!isValidPassword && (
              <Text style={styles.warningText}>비밀번호 형식이 올바르지 않습니다.</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder='비밀번호를 다시 입력해주세요'
                placeholderTextColor={'gray'}
                value={verifiedPassword}
                onChangeText={(text) => onChangeVerifiedPassword(text)}
                secureTextEntry
              />
            </View>
            {!isValidVerifiedPassword && (
              <Text style={styles.warningText}>비밀번호가 일치하지 않습니다.</Text>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={clickSignUpButton}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/auth/signIn')}
          >
            <Text style={styles.backButtonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 2 && (
        <View>
          <Text style={styles.title}>가입이 완료되었습니다.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/signIn')}>
            <Text style={styles.buttonText}>로그인 하기</Text>
          </TouchableOpacity>
        </View>
      )}
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
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347',
    fontFamily: fonts.defaultBold,
  },
  inputContainer: {
    marginBottom: 12,
  },
  optionBox: {
    width: '100%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBox: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: colors.accent,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    height: 50,
    fontFamily: fonts.default,
  },
  label: {
    fontSize: fonts.size.body,
    marginBottom: 4,
    color: colors.lightGray,
    fontFamily: fonts.defaultBold,
  },
  warningText: {
    fontSize: 12,
    color: colors.accent,
    paddingLeft: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: fonts.size.body,
    color: '#FFF',
    fontWeight: 'bold',
  },
  backButton: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: fonts.size.body,
    color: '#FFF',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
})
