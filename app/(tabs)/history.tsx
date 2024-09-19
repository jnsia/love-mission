import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import theme from '@/constants/Theme'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import HistoryTabs from '@/components/history/HistoryTabs'
import { supabase } from '@/utils/supabase'
import { fonts } from '@/constants/Fonts'

export default function History() {
  const [page, setPage] = useState('missions')
  // const [type, setType] = useState('전체')
  const [histories, setHistories] = useState<history[]>([])

  const user: user = useAuthStore((state: any) => state.user)

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
      <HistoryTabs page={page} setPage={setPage} />
      {/* <View>
        {page ? (
          <View style={styles.typeSelectBox}>
            <TouchableOpacity
              style={type === '전체' ? styles.typeActiveBtn : styles.typeBtn}
              onPress={() => setType('전체')}
            >
              <Text style={type === '전체' ? styles.activeText : styles.text}>전체</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={type === '획득' ? styles.typeActiveBtn : styles.typeBtn}
              onPress={() => setType('적립')}
            >
              <Text style={type === '적립' ? styles.activeText : styles.text}>적립</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={type === '차감' ? styles.typeActiveBtn : styles.typeBtn}
              onPress={() => setType('출금')}
            >
              <Text style={type === '출금' ? styles.activeText : styles.text}>출금</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.typeSelectBox}>
            <TouchableOpacity
              style={type === '전체' ? styles.typeActiveBtn : styles.typeBtn}
              onPress={() => setType('전체')}
            >
              <Text style={type === '전체' ? styles.activeText : styles.text}>전체</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={type === '획득' ? styles.typeActiveBtn : styles.typeBtn}
              onPress={() => setType('적립')}
            >
              <Text style={type === '적립' ? styles.activeText : styles.text}>적립</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={type === '차감' ? styles.typeActiveBtn : styles.typeBtn}
              onPress={() => setType('출금')}
            >
              <Text style={type === '출금' ? styles.activeText : styles.text}>출금</Text>
            </TouchableOpacity>
          </View>
        )}
      </View> */}
      <ScrollView style={styles.missionsBox}>
        {page === 'missions' && (
          <View>
            {histories.map((history) => (
              <View key={history.id}>
                <View style={styles.item}>
                  <Text style={styles.itemText}>{history.record}</Text>
                  <Text style={styles.itemSubText}>{history.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {page === 'coins' && (
          <View>
            {histories.map((history) => (
              <View key={history.id}>
                <View style={styles.coinItem}>
                  <View style={{ gap: 4 }}>
                    <Text style={styles.itemText}>{history.record}</Text>
                    <Text style={styles.itemSubText}>{history.date}</Text>
                  </View>
                  <Text style={styles.itemText}>+ {history.coin} Coin</Text>
                </View>
              </View>
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
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 10,
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
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  itemSubText: {
    fontSize: 14,
    color: '#cccccc',
    fontFamily: fonts.default,
  },
})
