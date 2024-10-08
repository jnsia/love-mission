import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { user } from '@/types/user'
import theme from '@/constants/Theme'
import { fonts } from '@/constants/Fonts'
import CouponInfoModal from './CouponInfoModal'
import { useFocusEffect } from 'expo-router'

export default function IssuedCouponList({
  page,
  setPage,
  coupons,
  getCoupons,
}: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
  coupons: coupon[]
  getCoupons: () => void

}) {
  const [isCouponInfoVisible, setIsCouponInfoVisible] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState(0)

  const clickCoupon = (coupon: coupon) => {
    setIsCouponInfoVisible(true)
    setSelectedCouponId(coupon.id)
  }

  const closeCouponInfoModal = () => {
    setIsCouponInfoVisible(false)
  }

  useFocusEffect(
    useCallback(() => {
      getCoupons()
    }, []),
  )

  return (
    <View>
      {coupons.map((coupon) => (
        <View key={coupon.id}>
          <TouchableOpacity style={styles.couponItem} onPress={() => clickCoupon(coupon)}>
            <View style={styles.couponContent}>
              <Text style={styles.couponText} numberOfLines={1}>
                {coupon.name}
              </Text>
              <Text style={styles.couponPrice}>{coupon.price} Coin</Text>
            </View>
          </TouchableOpacity>
          {selectedCouponId == coupon.id && (
            <CouponInfoModal
              page={page}
              setPage={setPage}
              getCoupons={getCoupons}
              closeCouponInfoModal={closeCouponInfoModal}
              isCouponInfoVisible={isCouponInfoVisible}
              coupon={coupon}
            />
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  couponItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
  },
  couponContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  couponText: {
    flex: 1,
    fontSize: fonts.size.body,
    marginRight: 4,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  couponPrice: {
    fontSize: fonts.size.body,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
})
