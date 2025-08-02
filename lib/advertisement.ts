import { user } from '@/types/user'
import { supabase } from '@/utils/supabase'
import { Alert } from 'react-native'
import MobileAds, {
  MaxAdContentRating,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads'

const rewardAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3115269616339333/7283099461'

const configureAdMob = async () => {
  await MobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForUnderAgeOfConsent: true,
    testDeviceIdentifiers: ['EMULATOR', '2077ef9a63d2b398840261c8221a0c9b'],
  })
}

export const rewarded = RewardedAd.createForAdRequest(rewardAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
})

export function initMobileAds() {
  configureAdMob()
  MobileAds()
    .initialize()
    .then((adapterStatuses) => {})
    .catch((error) => {
      console.error('Mobile Ads initialization failed')
    })
}

export function setRewardAdvertisement(user: user, getUserInfoByEmail: (email: string) => void) {
  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {})

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    async (reward) => {
      console.log(reward)

      const { error } = await supabase
        .from('users')
        .update({ coin: user.coin + 100 })
        .eq('id', user.id)

      if (error) {
        console.log(error)
        return
      }

      getUserInfoByEmail(user.email)
      Alert.alert('100Coin 지급 되었습니다!')
    },
  )

  rewarded.load()

  return () => {
    unsubscribeLoaded()
    unsubscribeEarned()
  }
}
