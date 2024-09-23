import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '@/constants/Fonts'
import { colors } from '@/constants/Colors'
import theme from '@/constants/Theme'
import { router } from 'expo-router'

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
                keyboardType="email-address"
                style={styles.input}
                placeholder="이메일"
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={(text) => onChangeEmail(text)}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="8자리 이상 입력해주세요."
                placeholderTextColor={'gray'}
                value={password}
                onChangeText={(text) => onChangePassword(text)}
                returnKeyType="next"
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
                placeholder="비밀번호를 다시 입력해주세요"
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
        </View>
      )}
      {step === 2 && (
        <View>
          <Text style={styles.title}>가입이 완료되었습니다.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/auth/signIn')}>
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
    borderColor: colors.deepRed,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    height: 50,
    fontFamily: fonts.default,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: colors.lightGray,
    fontFamily: fonts.defaultBold,
  },
  warningText: {
    fontSize: 12,
    color: colors.deepRed,
    paddingLeft: 12,
    marginTop: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF6347',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
