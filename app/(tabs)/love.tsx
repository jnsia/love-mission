import MissionInfoModal from '@/components/mission/MissionInfoModal'
import RegistButton from '@/components/common/RegistButton'
import MissionRegistModal from '@/components/mission/MissionRegistModal'
import theme from '@/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { mission } from '@/types/mission'
import { user } from '@/types/user'
import { supabase } from '@/utils/supabase'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { sendPushNotification } from '@/lib/sendPushNotification'
import { fonts } from '@/constants/Fonts'
import { colors } from '@/constants/Colors'

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
              <View style={styles.badge}>
                {mission.type == 'special' && <Text style={styles.badgeText}>특별</Text>}
                {mission.type == 'daily' && <Text style={styles.badgeText}>일일</Text>}
                {mission.type == 'emergency' && <Text style={styles.badgeText}>긴급</Text>}
                {mission.type == 'coupon' && <Text style={styles.badgeText}>쿠폰</Text>}
              </View>
              <Text style={styles.itemText} numberOfLines={1}>
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
          미션 독촉하기 (테스트 기능)
        </Text>
      </TouchableOpacity>
      <RegistButton text="미션 등록하기" onPressEvent={openModal} />
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
    borderColor: colors.deepRed,
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
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'green',
    marginBottom: 10,
  },
  warningItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.deepRed,
    marginBottom: 10,
  },
  completedItemText: {
    fontSize: 16,
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
