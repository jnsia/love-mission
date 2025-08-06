import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '@/shared/constants/Colors'
import { fonts } from '@/shared/constants/Fonts'

export default function HistoryTabs({
  page,
  setPage,
}: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabButton, page === 'missions' && styles.selectedTab]}
        onPress={() => setPage('missions')}
      >
        <Text style={[styles.tabText, page === 'missions' && styles.selectedTabText]}>
          미션 수행 이력
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, page === 'coins' && styles.selectedTab]}
        onPress={() => setPage('coins')}
      >
        <Text style={[styles.tabText, page === 'coins' && styles.selectedTabText]}>
          코인 획득 및 지출
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 4,
    borderBottomColor: colors.accent, // 선택된 탭의 스타일
  },
  tabText: {
    fontSize: 14,
    color: '#777', // 비선택된 탭의 텍스트 색상
  },
  selectedTabText: {
    color: colors.accent, // 선택된 탭의 텍스트 색상
    fontWeight: 'bold',
    fontFamily: fonts.default,
  },
})
