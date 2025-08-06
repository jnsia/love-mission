import CouponIssueModal from '@/features/coupon/CouponIssueModal'
import CouponTabs from '@/features/coupon/CouponTabs'
import IssuedCouponList from '@/features/coupon/IssuedCouponList'
import LoveCouponList from '@/features/coupon/LoveCouponList'
import MyCouponList from '@/features/coupon/MyCouponList'
import { fonts } from '@/shared/constants/Fonts'
import theme from '@/shared/constants/Theme'
import useAuthStore from '@/stores/authStore'
import { user } from '@/shared/types/user'
import { supabase } from '@/shared/utils/supabase'
import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import RegistButton from '@/shared/components/RegistButton'

export default function CouponListScreen() {
  const [page, setPage] = useState('myCoupons')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [issuedCoupons, setIssuedCoupons] = useState<coupon[]>([])

  const user: user = useAuthStore((state: any) => state.user)

  const openModal = () => {
    setPage('issuedCoupons')
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const getIssuedCoupons = async () => {
    const { data, error } = await supabase
      .from('loveCoupons')
      .select()
      .eq('userId', user.id)

    if (error) {
      console.error('Error fetching todos:', error.message)
      return
    }

    setIssuedCoupons(data)
  }

  return (
    <View style={styles.container}>
      <CouponTabs page={page} setPage={setPage} />
      <ScrollView style={styles.couponsContainer}>
        {page === 'myCoupons' && <MyCouponList page={page} setPage={setPage} />}
        {page === 'loveCoupons' && (
          <LoveCouponList page={page} setPage={setPage} />
        )}
        {page === 'issuedCoupons' && (
          <IssuedCouponList
            page={page}
            setPage={setPage}
            coupons={issuedCoupons}
            getCoupons={getIssuedCoupons}
          />
        )}
      </ScrollView>
      <View>
        <CouponIssueModal
          getIssuedCoupons={getIssuedCoupons}
          isModalVisible={isModalVisible}
          closeModal={closeModal}
        />
        <RegistButton text='쿠폰 발행하기' onPressEvent={openModal} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  couponsContainer: {
    marginTop: 16,
  },
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
