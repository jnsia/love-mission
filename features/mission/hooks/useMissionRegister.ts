import { sendPushNotification } from '@/shared/lib/pushNotification'
import { supabase } from '@/shared/utils/supabase'
import { MissionRegisterRequest } from '../types/mission'
import useAuthStore from '@/stores/authStore'

export default function useMissionRegister() {
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

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
