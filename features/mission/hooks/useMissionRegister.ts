import { sendPushNotification } from '@/shared/lib/pushNotification'
import { supabase } from '@/shared/lib/supabase/supabase'
import { MissionRegisterRequest } from '../types/mission'

export default function useMissionRegister() {
  const registerMission = async (request: MissionRegisterRequest) => {
    const { error } = await supabase.from('missions').insert(request)

    if (error) {
      console.error(error)
      return
    }

    await sendPushNotification(
      loveFcmToken,
      '연인이 미션을 등록하였습니다!',
      request.title,
      'home',
    )
  }

  return { registerMission }
}
