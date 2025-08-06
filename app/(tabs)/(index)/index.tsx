import { Alert, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import { supabase } from '@/shared/utils/supabase'
import { useCallback, useState } from 'react'
import { user } from '@/shared/types/user'
import useAuthStore from '@/stores/authStore'
import { failedMission, mission } from '@/features/mission/types/mission'
import theme from '@/shared/constants/Theme'
import { useFocusEffect } from 'expo-router'
import MissionInfoModal from '@/features/mission/MissionInfoModal'
import GuideView from '@/features/coupon/GuideView'
import FailedMissionInfoModal from '@/features/mission/FailedMissionInfoModal'
import MissionButton from '@/features/mission/MissionButton'
import CouponMissionButton from '@/features/mission/CouponMissionButton'

export default function HomeScreen() {
  const [missions, setMissions] = useState<mission[]>([])
  const [failedMissions, setFailedMissions] = useState<failedMission[]>([])
  const [completedMissions, setCompletedMissions] = useState<mission[]>([])
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [isFailedMissionInfoVisible, setIsFailedMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
  }

  const closeFailedMissionInfoModal = () => {
    try {
      failedMissions.forEach(async (failedMission) => {
        await supabase.from('failedMissions').delete().eq('id', failedMission.id)
      })
    } catch (error) {
      console.error(error)
      return
    }

    setFailedMissions([])
    setIsFailedMissionInfoVisible(false)
  }

  const clickMission = async (mission: mission) => {
    setSelctedMissionId(mission.id)
    setIsMissionInfoVisible(true)
  }

  const getMissions = async () => {
    try {
      const { data, error } = await supabase.from('missions').select().eq('userId', user.id)

      if (error) {
        console.error('index mission fetching fail:', error.message)
        return
      }

      const missions: mission[] = []
      const completedMissions: mission[] = []

      data.forEach((mission: mission) => {
        if (mission.completed) {
          completedMissions.push(mission)
        } else {
          if (mission.type == 'coupon') {
            missions.unshift(mission)
          } else {
            missions.push(mission)
          }
        }
      })

      setMissions(missions)
      setCompletedMissions(completedMissions)
    } catch (error: any) {
      console.error('index mission fetching fail:', error.message)
    }
  }

  const getFailedMissions = async () => {
    const { data, error } = await supabase.from('failedMissions').select().eq('userId', user.id)

    if (error) {
      console.error(error)
      return
    }

    if (data.length > 0) {
      setFailedMissions(data)
      setIsFailedMissionInfoVisible(true)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (user == null) return
      if (user.loveId == null) {
        getRecentUserInfo(user.id)
      }
      getMissions()
      getFailedMissions()

      const backAction = () => {
        Alert.alert('앱을 종료하시겠습니까?', '', [
          {
            text: '아니요',
            onPress: () => null,
            style: 'cancel',
          },
          { text: '예', onPress: () => BackHandler.exitApp() },
        ])

        return true // true를 반환해야 기본 뒤로가기를 막음
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

      return () => backHandler.remove() // 컴포넌트가 unmount 될 때 이벤트 리스너 제거
    }, [user]),
  )

  return (
    <View style={styles.container}>
      <GuideView
        texts={['연인이 당신에게 할당한 미션입니다!', '어서 미션을 완료하여 코인를 획득하세요.']}
      />
      <ScrollView>
        <View>
          {missions.map((mission) => (
            <View key={mission.id}>
              {mission.type == 'coupon' ? (
                <CouponMissionButton mission={mission} clickMission={() => clickMission(mission)} />
              ) : (
                <MissionButton mission={mission} clickMission={() => clickMission(mission)} />
              )}
              {selctedMissionId == mission.id && (
                <MissionInfoModal
                  getMissions={getMissions}
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
              <MissionButton mission={mission} clickMission={() => clickMission(mission)} />
              {selctedMissionId == mission.id && (
                <MissionInfoModal
                  getMissions={getMissions}
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
