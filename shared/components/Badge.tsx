import { View, StyleSheet } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import Typography from './Typography'

export default function Badge({ type }: { type: string }) {
  return (
    <View style={styles.badge}>
      {type == 'special' && <Typography variant="caption" color="primary">특별</Typography>}
      {type == 'daily' && <Typography variant="caption" color="primary">일일</Typography>}
      {type == 'emergency' && <Typography variant="caption" color="primary">긴급</Typography>}
      {type == 'coupon' && <Typography variant="caption" color="primary">쿠폰</Typography>}
      {type == 'complete' && <Typography variant="caption" color="primary">완료</Typography>}
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
})
