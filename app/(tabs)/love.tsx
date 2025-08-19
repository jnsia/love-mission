import MissionInfoModal from '@/features/mission/MissionInfoModal'
import MissionRegistModal from '@/features/mission/MissionRegisterModal'
import theme from '@/shared/constants/Theme'
import { Mission } from '@/features/mission/types/mission'
import { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import MissionButton from '@/features/mission/MissionButton'
import RegistButton from '@/shared/components/RegistButton'
import useMissions from '@/features/mission/hooks/useMissions'

export default function LoveScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const { missions, getMissions } = useMissions({ userId: user.loveId })

  const clickMission = (mission: Mission) => {
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

  return (
    <View style={styles.container}>
      <ScrollView>
        {missions.map((mission) => (
          <View key={mission.id}>
            <MissionButton
              mission={mission}
              clickMission={() => clickMission(mission)}
            />
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
