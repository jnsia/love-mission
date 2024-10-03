import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { mission } from '@/types/mission'
import Badge from '../common/Badge'
import { colors } from '@/constants/Colors'
import { fonts } from '@/constants/Fonts'

export default function CouponMissionButton({
  mission,
  clickMission,
}: {
  mission: mission
  clickMission: (mission: mission) => void
}) {
  return (
    <TouchableOpacity style={styles.couponItem} onPress={() => clickMission(mission)}>
      <Text style={{ ...styles.itemText, color: colors.accent }} numberOfLines={1}>
        빠른 시일 내에 해결해주세요!
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Badge type="coupon" />
        <Text style={styles.couponItemText} numberOfLines={1}>
          {mission.title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
})
