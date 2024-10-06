import MobileAds, {
  MaxAdContentRating,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads'

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3115269616339333/7283099461'

const configureAdMob = async () => {
  await MobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForUnderAgeOfConsent: true,
    testDeviceIdentifiers: ['EMULATOR', '2077ef9a63d2b398840261c8221a0c9b'],
  })
}

export const rewarded = RewardedAd.createForAdRequest(adUnitId, {
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

export function setRewardAdvertisement() {
  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    console.log('Load Reward Advertisement')
  })

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      console.log('User earned reward of ', reward)
    },
  )

  rewarded.load()

  return () => {
    unsubscribeLoaded()
    unsubscribeEarned()
  }
}
