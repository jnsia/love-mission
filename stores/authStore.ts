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

  getPIN: async (state: any) => {
    const PIN = await AsyncStorage.getItem('JNoteS_PIN')

    if (PIN === '980309' || PIN === '950718') {
      try {
        const { data, error } = await supabase.from('users').select().eq('pin', PIN)

        if (error) {
          console.error('유저 조회 중 에러:', error.message)
          return
        }

        const user: user = data[0]

        set({ isLoggedIn: true })
        set({ user: user })
      } catch (error: any) {
        console.error('에러인가:', error.message)
      }
    } else {
      return
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
    await AsyncStorage.removeItem('JNoteS_PIN')
    await supabase.from('users').update({ fcmToken: null }).eq('id', userId)
    router.replace('/(auth)')
  },
}))

export default useAuthStore
