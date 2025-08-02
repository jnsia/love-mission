import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { fonts } from '@/constants/Fonts'

export default function Badge({ type }: { type: string }) {
  return (
    <View style={styles.badge}>
      {type == 'special' && <Text style={styles.badgeText}>특별</Text>}
      {type == 'daily' && <Text style={styles.badgeText}>일일</Text>}
      {type == 'emergency' && <Text style={styles.badgeText}>긴급</Text>}
      {type == 'coupon' && <Text style={styles.badgeText}>쿠폰</Text>}
      {type == 'complete' && <Text style={styles.badgeText}>완료</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
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
