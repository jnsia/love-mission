import { supabase } from '@/shared/utils/supabase'
import { Mission } from '../types/mission'

export const fetchMissions = async (
  userId: number,
): Promise<Mission[] | null> => {
  const { data, error } = await supabase
    .from('missions')
    .select()
    .eq('userId', userId)

  if (error) {
    console.error('Error fetching missions:', error.message)
    return null
  }

  return data
}
