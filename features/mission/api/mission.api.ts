import { supabase } from '@/shared/lib/supabase/supabase'
import { Mission, MissionRegisterRequest } from '../types/mission'

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

export const registerMission = async (request: MissionRegisterRequest) => {
  const { error } = await supabase.from('missions').insert(request).select()

  if (error) {
    console.error('Error registering mission:', error.message)
  }
}
