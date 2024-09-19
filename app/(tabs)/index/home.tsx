import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { supabase } from '@/utils/supabase'
import { useCallback, useState } from 'react'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import { mission } from '@/types/mission'
import theme from '@/constants/Theme'
import { router, useFocusEffect } from 'expo-router'
import MissionInfoModal from '@/components/common/MissionInfoModal'
import { fonts } from '@/constants/Fonts'
import { colors } from '@/constants/Colors'

export default function HomeScreen() {
  const [missions, setMissions] = useState<mission[]>([])
  const [completedMissions, setCompletedMissions] = useState<mission[]>([])
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
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

  useFocusEffect(
    useCallback(() => {
      getMissions()
    }, []),
  )

  return (
    <View style={styles.container}>
      <View style={styles.guideBox}>
        <Text style={styles.guideText}>연인이 당신에게 할당한 미션입니다!</Text>
        <Text style={styles.guideText}>어서 미션을 완료하여 코인를 획득하세요.</Text>
      </View>
      <ScrollView style={styles.missionsBox}>
        <View>
          {missions.map((mission) => (
            <View key={mission.id}>
              {mission.type === 'coupon' ? (
                <TouchableOpacity style={styles.couponItem} onPress={() => clickMission(mission)}>
                  <Text style={{ ...styles.itemText, color: colors.deepRed }} numberOfLines={1}>
                    빠른 시일 내에 해결해주세요!
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>쿠폰</Text>
                    </View>
                    <Text style={styles.couponItemText} numberOfLines={1}>
                      {mission.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.item} onPress={() => clickMission(mission)}>
                  <View style={styles.badge}>
                    {mission.type == 'special' && <Text style={styles.badgeText}>특별</Text>}
                    {mission.type == 'daily' && <Text style={styles.badgeText}>일일</Text>}
                    {mission.type == 'emergency' && <Text style={styles.badgeText}>긴급</Text>}
                  </View>
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
  missionsBox: {
    marginTop: 16,
  },
  guideBox: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
  },
  guideText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: fonts.default,
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
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'green',
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
