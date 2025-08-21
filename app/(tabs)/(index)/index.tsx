import { Alert, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import { Mission, FailedMission } from '@/features/mission/types/mission'
import theme from '@/shared/constants/Theme'
import { useFocusEffect } from 'expo-router'
import MissionInfoModal from '@/features/mission/MissionInfoModal'
import GuideView from '@/features/coupon/components/GuideView'
import FailedMissionInfoModal from '@/features/mission/FailedMissionInfoModal'
import MissionButton from '@/features/mission/MissionButton'
import CouponMissionButton from '@/features/mission/CouponMissionButton'
import { useCurrentUser } from '@/shared/hooks/useAuth'
import { 
  useMissions, 
  useFailedMissions, 
  useCompletedMissions,
  useDeleteFailedMissions 
} from '@/shared/hooks/useMissions'

export default function HomeScreen() {
  const { data: user } = useCurrentUser()
  const { data: missions = [], refetch: refetchMissions } = useMissions(user?.id)
  const { data: failedMissions = [], refetch: refetchFailedMissions } = useFailedMissions(user?.id)
  const { data: completedMissions = [] } = useCompletedMissions(user?.id)
  const deleteFailedMissions = useDeleteFailedMissions()

  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [isFailedMissionInfoVisible, setIsFailedMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
  }

  const closeFailedMissionInfoModal = () => {
    const failedMissionIds = failedMissions.map(mission => mission.id)
    if (failedMissionIds.length > 0) {
      deleteFailedMissions.mutate(failedMissionIds)
    }
    setIsFailedMissionInfoVisible(false)
  }

  const clickMission = async (mission: Mission) => {
    setSelctedMissionId(mission.id)
    setIsMissionInfoVisible(true)
  }

  // 실패한 미션이 있을 때 모달 표시
  useFocusEffect(
    React.useCallback(() => {
      if (failedMissions.length > 0 && !isFailedMissionInfoVisible) {
        setIsFailedMissionInfoVisible(true)
      }
    }, [failedMissions])
  )

  // 뒤로가기 처리
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('앱을 종료하시겠습니까?', '', [
          {
            text: '아니요',
            onPress: () => null,
            style: 'cancel',
          },
          { text: '예', onPress: () => BackHandler.exitApp() },
        ])

        return true
      }

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      )

      return () => backHandler.remove()
    }, []),
  )

  // 미션 목록 정렬 (쿠폰 미션 우선)
  const sortedMissions = React.useMemo(() => {
    return [...missions].sort((a, b) => {
      if (a.type === 'coupon' && b.type !== 'coupon') return -1
      if (a.type !== 'coupon' && b.type === 'coupon') return 1
      return 0
    })
  }, [missions])

  return (
    <View style={styles.container}>
      <GuideView
        texts={[
          '연인이 당신에게 할당한 미션입니다!',
          '어서 미션을 완료하여 코인를 획득하세요.',
        ]}
      />
      <ScrollView>
        <View>
          {sortedMissions.map((mission) => (
            <View key={mission.id}>
              {mission.type === 'coupon' ? (
                <CouponMissionButton
                  mission={mission}
                  clickMission={() => clickMission(mission)}
                />
              ) : (
                <MissionButton
                  mission={mission}
                  clickMission={() => clickMission(mission)}
                />
              )}
              {selctedMissionId === mission.id && (
                <MissionInfoModal
                  isMissionInfoVisible={isMissionInfoVisible}
                  mission={mission}
                  closeMissionInfoModal={closeMissionInfoModal}
                />
              )}
            </View>
          ))}
        </View>
        <View>
          {completedMissions.map((mission) => (
            <View key={mission.id}>
              <MissionButton
                mission={mission}
                clickMission={() => clickMission(mission)}
              />
              {selctedMissionId === mission.id && (
                <MissionInfoModal
                  isMissionInfoVisible={isMissionInfoVisible}
                  mission={mission}
                  closeMissionInfoModal={closeMissionInfoModal}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <FailedMissionInfoModal
        failedMissions={failedMissions}
        isFailedMissionInfoVisible={isFailedMissionInfoVisible}
        closeFailedMissionInfoModal={closeFailedMissionInfoModal}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347',
  },
})
