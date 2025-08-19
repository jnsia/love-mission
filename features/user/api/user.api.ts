import { supabase } from '@/shared/lib/supabase/supabase'
import { User } from '../types/user.type'
import { getAuthData } from '@/shared/lib/async-storage/auth'

export const fetchCurrentUser = async (): Promise<User | null> => {
  const authData = await getAuthData()
  if (authData == null) {
    return null
  }

  return await fetchUserByEmail(authData.email)
}

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)

  if (error) {
    console.error('Error fetching user by email:', error)
    return null
  }

  if (data == null || data.length === 0) {
    return null
  }

  return data[0]
}

export const updateSecret = async (userId: number, secret: string | null) => {
  const { error } = await supabase
    .from('users')
    .update({ secret })
    .eq('id', userId)

  if (error) {
    console.error('Error updating secret:', error)
    return null
  }
}

export const fetchUserBySecret = async (
  secret: string,
): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('secret', secret)

  if (error) {
    console.error('Error fetching user by secret:', error)
    return null
  }

  if (data == null || data.length === 0) {
    return null
  }

  return data[0]
}

export const updateUserLoveId = async (
  userId: number,
  loveId: number,
): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ loveId })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user loveId:', error)
    throw error
  }
}
