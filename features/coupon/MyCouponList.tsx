import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/shared/utils/supabase'
import { user } from '@/features/user/types/user.type'
import useAuthStore from '@/stores/authStore'
import theme from '@/shared/constants/Theme'
import { fonts } from '@/shared/constants/Fonts'
import CouponInfoModal from './CouponInfoModal'
import { useFocusEffect } from 'expo-router'

export default function MyCouponList({
  page,
  setPage,
}: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
}) {
  const [myCoupons, setMyCoupons] = useState<coupon[]>([])
  const [isCouponInfoVisible, setIsCouponInfoVisible] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState(0)

  const user: user = useAuthStore((state: any) => state.user)

  const clickCoupon = (coupon: coupon) => {
    setIsCouponInfoVisible(true)
    setSelectedCouponId(coupon.id)
  }

  const closeCouponInfoModal = () => {
    setIsCouponInfoVisible(false)
  }

  const getMyCoupons = async () => {
    const { data, error } = await supabase
      .from('myCoupons')
      .select()
      .eq('userId', user.id)

    if (error) {
      console.error('Error fetching todos:', error.message)
      return
    }

    setMyCoupons(data)
  }

  useEffect(() => {
    getMyCoupons()
  }, [])

  useFocusEffect(
    useCallback(() => {
      getMyCoupons()
    }, []),
  )

  return (
    <View>
      {myCoupons.map((coupon) => (
        <View key={coupon.id}>
          <TouchableOpacity
            style={styles.couponItem}
            onPress={() => clickCoupon(coupon)}
          >
            <Text style={styles.couponText}>{coupon.name}</Text>
          </TouchableOpacity>
          {selectedCouponId == coupon.id && (
            <CouponInfoModal
              page={page}
              setPage={setPage}
              getCoupons={getMyCoupons}
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
  couponText: {
    flex: 1,
    fontSize: fonts.size.body,
    marginRight: 4,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
})
