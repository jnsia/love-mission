import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { user } from '@/types/user'
import useAuthStore from '@/stores/authStore'
import theme from '@/constants/Theme'
import { fonts } from '@/constants/Fonts'
import CouponInfoModal from './CouponInfoModal'
import { useFocusEffect } from 'expo-router'

export default function LoveCouponList({
  page,
  setPage,
}: {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
}) {
  const [loveCoupons, setLoveCoupons] = useState<coupon[]>([])
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

  const getLoveCoupons = async () => {
    const { data, error } = await supabase.from('loveCoupons').select().eq('userId', user.loveId)

    if (error) {
      console.error('Error fetching loveCoupons:', error.message)
      return
    }

    setLoveCoupons(data)
  }

  useFocusEffect(
    useCallback(() => {
      getLoveCoupons()
    }, []),
  )

  return (
    <View>
      {loveCoupons.map((coupon) => (
        <View key={coupon.id}>
          <TouchableOpacity style={styles.couponItem} onPress={() => clickCoupon(coupon)}>
            <View style={styles.couponContent}>
              <Text style={styles.couponText}>{coupon.name}</Text>
              <Text style={styles.couponPrice}>{coupon.price} Coin</Text>
            </View>
          </TouchableOpacity>
          {selectedCouponId == coupon.id && (
            <CouponInfoModal
              page={page}
              setPage={setPage}
              getCoupons={getLoveCoupons}
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
