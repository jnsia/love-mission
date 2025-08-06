import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { colors } from '@/shared/constants/Colors'
import { fonts } from '@/shared/constants/Fonts'

export default function CouponTabs({
  page,
  setPage,
}: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabButton, page === 'myCoupons' && styles.selectedTab]}
        onPress={() => setPage('myCoupons')}
      >
        <Text style={[styles.tabText, page === 'myCoupons' && styles.selectedTabText]}>
          보유한 쿠폰
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, page === 'loveCoupons' && styles.selectedTab]}
        onPress={() => setPage('loveCoupons')}
      >
        <Text style={[styles.tabText, page === 'loveCoupons' && styles.selectedTabText]}>
          구매 가능 쿠폰
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, page === 'issuedCoupons' && styles.selectedTab]}
        onPress={() => setPage('issuedCoupons')}
      >
        <Text style={[styles.tabText, page === 'issuedCoupons' && styles.selectedTabText]}>
          발행한 쿠폰
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
