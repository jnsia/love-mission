import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { supabase } from '@/utils/supabase'
import { useCallback, useEffect, useState } from 'react'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { failedMission, mission } from '@/types/mission'
import theme from '@/constants/Theme'
import { router, useFocusEffect } from 'expo-router'
import MissionInfoModal from '@/components/mission/MissionInfoModal'
import { fonts } from '@/constants/Fonts'
import { colors } from '@/constants/Colors'
import GuideView from '@/components/coupon/GuideView'
import FailedMissionInfoModal from '@/components/mission/FailedMissionInfoModal'
import Badge from '@/components/common/Badge'
import MissionContainer from '@/components/mission/MissionButton'
import MissionButton from '@/components/mission/MissionButton'
import CouponMissionButton from '@/components/mission/CouponMissionButton'
import { useRoute } from '@react-navigation/native'

export default function HomeScreen() {
  const [missions, setMissions] = useState<mission[]>([])
  const [failedMissions, setFailedMissions] = useState<failedMission[]>([])
  const [completedMissions, setCompletedMissions] = useState<mission[]>([])
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [isFailedMissionInfoVisible, setIsFailedMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)
  const getRecentUserInfo = useAuthStore((state: any) => state.getRecentUserInfo)

  const route = useRoute()

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
