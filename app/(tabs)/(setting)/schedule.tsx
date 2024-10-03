import MissionInfoModal from '@/components/mission/MissionInfoModal'
import RegistButton from '@/components/common/RegistButton'
import theme from '@/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { mission } from '@/types/mission'
import { user } from '@/types/user'
import { supabase } from '@/utils/supabase'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { fonts } from '@/constants/Fonts'
import { colors } from '@/constants/Colors'
import GuideView from '@/components/coupon/GuideView'
import ScheduledMissionRegistModal from '@/components/mission/ScheduledMissionRegistModal'
import CancelButton from '@/components/common/CancelButton'
import ScheduledMissionInfoModal from '@/components/mission/ScheduledMissionInfoModal'

export default function ScheduleScreen() {
  const [missions, setMissions] = useState<mission[]>([])
  const [completedMissions, setCompletedMissions] = useState<mission[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

  const getMissions = async () => {
    const { data, error } = await supabase
      .from('scheduledMissions')
      .select()
      .eq('userId', user.loveId)

    if (error) {
      console.error('Error fetching missions:', error.message)
      return
    }

    const missions: mission[] = []
    const completedMissions: mission[] = []

    data.forEach((mission: mission) => {
      if (mission.completed) {
        completedMissions.push(mission)
      } else {
        missions.push(mission)
      }
    })

    setMissions(missions)
    setCompletedMissions(completedMissions)
  }

  const clickMission = (mission: mission) => {
    setSelctedMissionId(mission.id)
    setIsMissionInfoVisible(true)
  }

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  useFocusEffect(
    useCallback(() => {
      getMissions()
    }, []),
  )

  return (
    <View style={styles.container}>
      <GuideView texts={['연인의 일일 미션을 관리할 수 있습니다.']} />
      <ScrollView>
        {completedMissions.map((mission: mission) => (
          <View key={mission.id}>
            <TouchableOpacity style={styles.completedItem} onPress={() => clickMission(mission)}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>쿠폰</Text>
              </View>
              <Text style={styles.completedItemText} numberOfLines={1}>
                {mission.title}
              </Text>
            </TouchableOpacity>
            {selctedMissionId == mission.id && (
              <MissionInfoModal
                getMissions={getMissions}
                closeMissionInfoModal={closeMissionInfoModal}
                isMissionInfoVisible={isMissionInfoVisible}
                mission={mission}
              />
            )}
          </View>
        ))}
        {missions.map((mission) => (
          <View key={mission.id}>
            <TouchableOpacity style={styles.item} onPress={() => clickMission(mission)}>
              <Text style={styles.itemText} numberOfLines={1}>
                {mission.title}
              </Text>
            </TouchableOpacity>
            {selctedMissionId == mission.id && (
              <ScheduledMissionInfoModal
                getMissions={getMissions}
                closeMissionInfoModal={closeMissionInfoModal}
                isMissionInfoVisible={isMissionInfoVisible}
                mission={mission}
              />
            )}
          </View>
        ))}
      </ScrollView>
      <ScheduledMissionRegistModal
        getMissions={getMissions}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <View style={{ marginBottom: 10 }}>
        <RegistButton text="일일 미션 예약하기" onPressEvent={openModal} />
        <CancelButton text="닫기" onPressEvent={() => router.back()} />
      </View>
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
    fontSize: fonts.size.body,


    flex: 1,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  couponItemText: {
    fontSize: fonts.size.body,


    flex: 1,
    fontFamily: fonts.defaultBold,
    color: theme.colors.text,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'green',
    marginBottom: 10,
  },
  warningItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.accent,
    marginBottom: 10,
  },
  completedItemText: {
    fontSize: fonts.size.body,


    color: 'white',
    fontFamily: fonts.default,
  },
  badge: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: fonts.default,
    fontSize: 10,
    color: theme.colors.text,
  },
})
