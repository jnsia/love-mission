import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { Mission } from '@/features/mission/types/mission'
import { colors } from '@/shared/constants/Colors'
import { fonts } from '@/shared/constants/Fonts'
import Badge from '@/shared/components/Badge'

export default function CouponMissionButton({
  mission,
  clickMission,
}: {
  mission: Mission
  clickMission: (mission: Mission) => void
}) {
  return (
    <TouchableOpacity
      style={styles.couponItem}
      onPress={() => clickMission(mission)}
    >
      <Text
        style={{ ...styles.itemText, color: colors.accent }}
        numberOfLines={1}
      >
        빠른 시일 내에 해결해주세요!
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Badge type='coupon' />
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
    fontSize: fonts.size.body,

    flex: 1,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  couponItemText: {
    fontSize: fonts.size.body,

    flex: 1,
    fontFamily: fonts.defaultBold,
    color: theme.colors.text,
  },
})
