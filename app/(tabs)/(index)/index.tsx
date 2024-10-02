import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { supabase } from '@/utils/supabase'
import { useCallback, useState } from 'react'
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
              {mission.type === 'coupon' ? (
                <TouchableOpacity style={styles.couponItem} onPress={() => clickMission(mission)}>
                  <Text style={{ ...styles.itemText, color: colors.accent }} numberOfLines={1}>
                    빠른 시일 내에 해결해주세요!
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Badge type="coupon" />
                    <Text style={styles.couponItemText} numberOfLines={1}>
                      {mission.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.item} onPress={() => clickMission(mission)}>
                  <Badge type={mission.type} />
                  <Text style={styles.itemText} numberOfLines={1}>
                    {mission.title}
                  </Text>
                </TouchableOpacity>
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
              <TouchableOpacity style={styles.completedItem} onPress={() => clickMission(mission)}>
                <Badge type="complete" />
                <Text style={styles.completedItemText} numberOfLines={1}>
                  {mission.title}
                </Text>
              </TouchableOpacity>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
  },
  couponItem: {
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    gap: 8,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  couponItemText: {
    fontSize: 16,
    flex: 1,
    fontFamily: fonts.defaultBold,
    color: theme.colors.text,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    marginBottom: 10,
  },
  completedItemText: {
    fontSize: 16,
    color: 'white',
    fontFamily: fonts.default,
  },
})
