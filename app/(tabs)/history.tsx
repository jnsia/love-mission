import React, { useCallback, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import theme from '@/shared/constants/Theme'
import { User } from '@/features/user/types/user.type'
import HistoryTabs from '@/features/history/HistoryTabs'
import { supabase } from '@/shared/lib/supabase/supabase'
import { fonts } from '@/shared/constants/Fonts'
import HistoryInfoModal from '@/features/history/HistoryInfoModal'

export default function History() {
  const [page, setPage] = useState('missions')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedHistoryId, setSelctedHistoryId] = useState(0)
  const [histories, setHistories] = useState<history[]>([])

  const getHistories = async () => {
    const { data, error } = await supabase
      .from('histories')
      .select()
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('히스토리 조회 중 에러')
      return
    }

    setHistories(data)
  }

  const clickHistory = (historyId: number) => {
    setIsModalVisible(true)
    setSelctedHistoryId(historyId)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  useFocusEffect(
    useCallback(() => {
      getHistories()
    }, []),
  )

  return (
    <View style={styles.container}>
      <HistoryTabs page={page} setPage={setPage} />
      <ScrollView style={styles.missionsBox}>
        {page === 'missions' && (
          <View>
            {histories.map((history) => (
              <TouchableOpacity
                key={history.id}
                style={styles.item}
                onPress={() => clickHistory(history.id)}
              >
                <Text style={styles.itemText}>{history.record}</Text>
                <Text style={styles.itemSubText}>{history.date}</Text>
                {selectedHistoryId == history.id && (
                  <HistoryInfoModal
                    isModalVisible={isModalVisible}
                    closeModal={closeModal}
                    history={history}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        {page === 'coins' && (
          <View>
            {histories.map((history) => (
              <TouchableOpacity
                key={history.id}
                style={styles.coinItem}
                onPress={() => clickHistory(history.id)}
              >
                <View
                  style={{
                    flex: 1,
                    gap: 4,
                    flexWrap: 'nowrap',
                    marginRight: 12,
                  }}
                >
                  <Text style={styles.itemText} numberOfLines={1}>
                    {history.record}
                  </Text>
                  <Text style={styles.itemSubText}>{history.date}</Text>
                </View>
                <Text style={styles.itemText}>
                  {history.coin > 0 ? `+${history.coin}` : history.coin} Coin
                </Text>
                {selectedHistoryId == history.id && (
                  <HistoryInfoModal
                    isModalVisible={isModalVisible}
                    closeModal={closeModal}
                    history={history}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  missionsBox: {
    marginTop: 16,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.default,
  },
  activeText: {
    color: '#FFC500',
    fontSize: 12,
    fontFamily: fonts.default,
  },
  typeSelectBox: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  typeBtn: {
    borderWidth: 0.5,
    borderColor: 'white',
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeActiveBtn: {
    borderWidth: 0.5,
    borderColor: '#FFC500',
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  item: {
    overflow: 'hidden',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: fonts.size.body,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  itemSubText: {
    fontSize: 12,
    color: '#cccccc',
    fontFamily: fonts.default,
  },
})
