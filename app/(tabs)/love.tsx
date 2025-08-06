import MissionInfoModal from '@/features/mission/MissionInfoModal'
import RegistButton from '@/features/common/RegistButton'
import MissionRegistModal from '@/features/mission/MissionRegistModal'
import theme from '@/shared/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { mission } from '@/features/mission/types/mission'
import { user } from '@/shared/types/user'
import { supabase } from '@/shared/utils/supabase'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { sendPushNotification } from '@/shared/lib/pushNotification'
import { fonts } from '@/shared/constants/Fonts'
import { colors } from '@/shared/constants/Colors'
import Badge from '@/features/common/Badge'
import MissionButton from '@/features/mission/MissionButton'

export default function LoveScreen() {
  const [missions, setMissions] = useState<mission[]>([])
  const [completedMissions, setCompletedMissions] = useState<mission[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)
  const loveFcmToken: string = useAuthStore((state: any) => state.loveFcmToken)

  const getMissions = async () => {
    const { data, error } = await supabase.from('missions').select().eq('userId', user.loveId)

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

  const pressMorePress = () => {
    sendPushNotification(loveFcmToken, '미션 수행 독촉 알림', '빨리 미션 수행 안해?!', 'home')
  }

  useFocusEffect(
    useCallback(() => {
      getMissions()
    }, []),
  )

  return (
    <View style={styles.container}>
      <ScrollView>
        {completedMissions.map((mission: mission) => (
          <View key={mission.id}>
            <MissionButton mission={mission} clickMission={() => clickMission(mission)} />
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
            <MissionButton mission={mission} clickMission={() => clickMission(mission)} />
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
      </ScrollView>
      <MissionRegistModal
        getMissions={getMissions}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          marginBottom: 8,
          alignItems: 'center',
          padding: 12,
          borderRadius: 5,
        }}
        onPress={pressMorePress}
      >
        <Text
          style={{
            fontWeight: 'bold',
          }}
        >
          미션 수행 독촉하기
        </Text>
      </TouchableOpacity>
      <RegistButton text='미션 등록하기' onPressEvent={openModal} />
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
