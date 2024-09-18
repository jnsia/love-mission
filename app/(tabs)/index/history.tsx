import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import theme from '@/constants/Theme'
import { useFocusEffect } from 'expo-router'
import { supabase } from '@/utils/supabase'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'

export default function history() {
  const [histories, setHistories] = useState<history[]>([])

  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
  }

  const clickMission = async (mission: history) => {
    setSelctedMissionId(mission.id)
    setIsMissionInfoVisible(true)
  }

  const getHistories = async () => {
    const { data, error } = await supabase.from('histories').select().eq('userId', user.id)

    if (error) {
      console.error('히스토리 조회 중 에러')
      return
    }

    setHistories(data)
  }

  useFocusEffect(
    useCallback(() => {
      getHistories()
    }, []),
  )

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {histories.map((history) => (
            <View key={history.id}>
              <View style={styles.item}>
                <Text style={styles.itemText}>{history.record}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                  }}
                >
                  <Text style={styles.itemSubText}>{history.date}</Text>
                  <Text style={styles.itemText}>+ {history.coin} Coin</Text>
                </View>
              </View>
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
  item: {
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  itemSubText: {
    fontSize: 14,
    color: '#cccccc',
  },
})
