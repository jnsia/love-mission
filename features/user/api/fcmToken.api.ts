import { supabase } from '@/shared/lib/supabase/supabase'

export const upsertFcmToken = async (userId: number, token: string) => {
  await supabase.from('users').update({ fcmToken: token }).eq('id', userId)
}

export const getFcmToken = async (userId: number): Promise<string | null> => {
  const { data } = await supabase
    .from('users')
    .select('fcmToken')
    .eq('id', userId)

  if (data == null || data.length === 0) {
    return null
  }

  return data[0].fcmToken
}

export const clearFcmToken = async (email: string) => {
  await supabase.from('users').update({ fcmToken: null }).eq('email', email)
}
