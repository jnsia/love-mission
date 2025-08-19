import {
  clearAuthData,
  getAuthData,
  setAuthData,
} from '@/shared/lib/async-storage/auth'
import { supabase } from '@/shared/lib/supabase/supabase'
import { clearFcmToken, upsertFcmToken } from './fcmToken.api'
import { fetchUserByEmail } from './user.api'
import { registerForPushNotificationsAsync } from '@/shared/lib/pushNotification'

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    console.error('Sign in error:', error)
    return null
  }

  const user = await fetchUserByEmail(email)
  if (user == null) {
    return null
  }

  await setAuthData(email)

  const token = await registerForPushNotificationsAsync()
  if (token) {
    await upsertFcmToken(user.id, token)
    user.fcmToken = token
  }

  return user
}

export const logout = async () => {
  const authData = await getAuthData()
  if (authData) {
    await clearFcmToken(authData.email)
  }

  await clearAuthData()
}
