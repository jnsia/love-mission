import { user } from '@/types/user'
import { supabase } from '@/utils/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { create } from 'zustand'

const useScreenStore = create((set) => ({
  isStacked: false,

  updateIsStacked: () => {
    set((state: any) => {
      isStacked: !state.isStacked
    })
  },
}))

export default useScreenStore
