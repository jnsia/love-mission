import { registerForPushNotificationsAsync } from '@/lib/pushNotification'
import { user } from '@/types/user'
import { supabase } from '@/utils/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // Sample Code
  // count: 0
  // set((state: any) => ({count: state.count + 1}))

  isLoggedIn: false,
  user: null,
  loveFcmToken: null,

  setIsLoggedIn: (state: boolean) => {
    set({ isLoggedIn: state })
  },

  getRecentUserInfo: async (userId: any) => {
    const { data, error } = await supabase.from('users').select().eq('id', userId)

    if (error) {
      console.error('Error fetching user:', error.message)
      return
    }

    const user: user = data[0]
    set({ user: user })
  },

  getUserInfoByEmail: async (email: any) => {
    const { data, error } = await supabase.from('users').select().eq('email', email)

    if (error) {
      console.error('Error fetching user:', error.message)
      return
    }

    const user: user = data[0]
    set({ user: user })

    return user
  },

  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) return null

      const { data } = await supabase.from('users').select().eq('email', email)

      if (data == null) {
        return null
      }

      const user = data[0]

      await AsyncStorage.setItem('isLoggedInLoveMission', user?.email)

      // FCM 토큰 발급 및 저장
      const token = await registerForPushNotificationsAsync()

      if (token) {
        // FCM token 저장을 비동기로 처리
        saveFcmToken(user.id, token)
        user.fcmToken = token
      }

      set({ user: user })
      set({ isLoggedIn: true })

      return user
    } catch (error: any) {
      console.error('로그인 중 에러:', error.message)
      return null
    }
  },

  getLoveFcmToken: async (loveId: number) => {
    const { data } = await supabase.from('users').select('fcmToken').eq('id', loveId)

    if (data == null) {
      throw new Error('연인에 대한 정보 없음')
    } else {
      set({ loveFcmToken: data[0].fcmToken })
    }
  },

  logout: async (userId: number) => {
    set({ isLoggedIn: false })
    await AsyncStorage.removeItem('isLoggedInLoveMission')
    await supabase.from('users').update({ fcmToken: null }).eq('id', userId)
    set({ user: null })
    router.replace('/auth/signIn')
  },
}))

const saveFcmToken = async (userId: number, token: string) => {
  await supabase.from('users').update({ fcmToken: token }).eq('id', userId)
}

export default useAuthStore
