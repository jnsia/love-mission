import { colors } from '@/constants/Colors'
import { fonts } from '@/constants/Fonts'
import theme from '@/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { user } from '@/types/user'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function ConnectScreen() {
  const [pin, setPin] = useState('')
  const [checkPin, setCheckPin] = useState(true)

  const [animation] = useState(new Animated.Value(1))

  const user = useAuthStore((state: any) => state.user)
  const isLoggedIn = useAuthStore((state: any) => state.isLoggedIn)
  const getPIN = useAuthStore((state: any) => state.getPIN)

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

  const signIn = async () => {
    if (pin.length !== 6) {
      setCheckPin(true)
      return
    }

    await AsyncStorage.setItem('JNoteS_PIN', pin)
    await getPIN()

    if (user === null) {
      setCheckPin(false)
    } else {
      setCheckPin(true)
      router.replace('/(tabs)')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>남자친구/여자친구의 생년월일을 입력해주세요!</Text>
      <Animated.View style={[styles.inputContainer, { transform: [{ scale: animation }] }]}>
        <FontAwesome name="lock" size={24} color="#FF6347" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="000000"
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={6}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      {!checkPin && <Text style={styles.warningText}>연인의 생년월일을 다시 확인해주세요.</Text>}
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>인증</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347',
    fontFamily: fonts.defaultBold,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: colors.deepRed,
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
  },
  warningText: {
    color: colors.deepRed,
    marginBottom: 10,
  },
  button: {
    width: '100%',
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
